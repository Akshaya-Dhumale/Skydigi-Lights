<?php
// ─────────────────────────────────────────────────────────────
// contact.php — robust Gmail SMTP version
// ─────────────────────────────────────────────────────────────

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request (browser CORS check)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// ★★★ EDIT THESE 3 LINES ★★★
$gmail_user     = "akshayadhumale@gmail.com";       // Your Gmail address
$gmail_password = "iobc betx fugu ecba";  // 16-char Gmail App Password
$notify_to      = "bugaticar1988@gmail.com";       // Recipient Gmail

// Read body — support both JSON and form POST
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!$data) $data = $_POST; // fallback

function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? "")));
}

$name    = clean($data["from_name"]    ?? "");
$phone   = clean($data["phone"]        ?? "");
$email   = clean($data["from_email"]   ?? "Not provided");
$inquiry = clean($data["inquiry_type"] ?? "General");
$message = clean($data["message"]      ?? "No message");

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Name and phone required"]);
    exit;
}

$subject = "New Enquiry from $name - Skydigi Lights";
$body    = "New enquiry from Skydigi Lights website:\r\n\r\n"
         . "Name     : $name\r\n"
         . "Phone    : $phone\r\n"
         . "Email    : $email\r\n"
         . "Enquiry  : $inquiry\r\n\r\n"
         . "Message:\r\n$message\r\n\r\n"
         . "-----------------------------\r\n"
         . "Sent from Skydigi Lights Website";

// ── Try PHPMailer if available, otherwise raw SMTP ───────────
// Check if PHPMailer exists (some hosts pre-install it)
$phpmailer_path = __DIR__ . "/PHPMailer/src/PHPMailer.php";

if (file_exists($phpmailer_path)) {
    // Use PHPMailer
    require $phpmailer_path;
    require __DIR__ . "/PHPMailer/src/SMTP.php";
    require __DIR__ . "/PHPMailer/src/Exception.php";

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = "smtp.gmail.com";
        $mail->SMTPAuth   = true;
        $mail->Username   = $gmail_user;
        $mail->Password   = $gmail_password;
        $mail->SMTPSecure = "ssl";
        $mail->Port       = 465;
        $mail->setFrom($gmail_user, "SkydigiLights");
        $mail->addAddress($notify_to);
        $mail->Subject    = $subject;
        $mail->Body       = $body;
        $mail->send();
        echo json_encode(["success" => true, "message" => "Sent via PHPMailer"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "PHPMailer error: " . $mail->ErrorInfo]);
    }

} else {
    // Raw SMTP via fsockopen
    $smtp_host = "ssl://smtp.gmail.com";
    $smtp_port = 465;

    $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 15);
    if (!$socket) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Cannot connect to Gmail SMTP. Error $errno: $errstr. Your host may block outgoing port 465."
        ]);
        exit;
    }

    function smtp_cmd($socket, $cmd = "") {
        if ($cmd !== "") fwrite($socket, $cmd . "\r\n");
        $res = "";
        $attempts = 0;
        while ($line = fgets($socket, 512)) {
            $res .= $line;
            $attempts++;
            if (strlen($line) >= 4 && $line[3] === " ") break;
            if ($attempts > 50) break; // safety
        }
        return $res;
    }

    smtp_cmd($socket);                                 // greeting
    smtp_cmd($socket, "EHLO localhost");
    smtp_cmd($socket, "AUTH LOGIN");
    smtp_cmd($socket, base64_encode($gmail_user));
    $auth = smtp_cmd($socket, base64_encode($gmail_password));

    $auth_code = (int)substr(trim($auth), 0, 3);
    if ($auth_code !== 235) {
        fclose($socket);
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Gmail auth failed (code $auth_code). Make sure you used an App Password, not your regular Gmail password."
        ]);
        exit;
    }

    smtp_cmd($socket, "MAIL FROM:<$gmail_user>");
    smtp_cmd($socket, "RCPT TO:<$notify_to>");
    smtp_cmd($socket, "DATA");

    $msg  = "From: Skydigi Lights <$gmail_user>\r\n";
    $msg .= "To: <$notify_to>\r\n";
    $msg .= "Reply-To: $email\r\n";
    $msg .= "Subject: $subject\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $msg .= "\r\n";
    $msg .= $body . "\r\n.\r\n";

    $result    = smtp_cmd($socket, $msg);
    $result_code = (int)substr(trim($result), 0, 3);
    smtp_cmd($socket, "QUIT");
    fclose($socket);

    if ($result_code === 250) {
        echo json_encode(["success" => true, "message" => "Sent via SMTP"]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "SMTP send failed with code $result_code: $result"
        ]);
    }
}
?>