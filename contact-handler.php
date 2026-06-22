<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

function clean($value) {
  return trim(strip_tags((string) $value));
}

$honeypot = clean($_POST['company_website'] ?? '');
if ($honeypot !== '') {
  echo json_encode(['ok' => true, 'message' => 'Submitted']);
  exit;
}

$name = clean($_POST['name'] ?? '');
$email = filter_var(clean($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = clean($_POST['phone'] ?? '');
$service = clean($_POST['service'] ?? '');
$message = clean($_POST['message'] ?? '');

if ($name === '' || !$email || $message === '') {
  http_response_code(422);
  echo json_encode(['ok' => false, 'message' => 'Please provide name, valid email, and message.']);
  exit;
}

$to = 'contact@nydrexplus.com';
$subject = 'Nydrex Plus project inquiry';
$body = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\n\nMessage:\n$message\n";
$headers = "From: Nydrex Plus Website <no-reply@nydrexplus.com>\r\nReply-To: $email\r\n";

$sent = mail($to, $subject, $body, $headers);
if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Email could not be sent. Please use WhatsApp or email fallback.']);
  exit;
}

echo json_encode(['ok' => true, 'message' => 'Inquiry sent successfully.']);
