<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Получаем данные из POST запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Конфигурация Telegram
$BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Замените на ваш токен
$CHAT_ID = 'YOUR_CHAT_ID';     // Замените на ID чата

// Валидация обязательных полей
$required_fields = ['inn', 'company_name', 'guarantee_type', 'mode', 'date_start', 'date_end', 'sum_bg', 'contact'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Форматирование сообщения
$message = formatTelegramMessage($input);

// Отправка в Telegram
$url = "https://api.telegram.org/bot$BOT_TOKEN/sendMessage";
$data = [
    'chat_id' => $CHAT_ID,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode(['success' => true, 'message' => 'Lead sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send to Telegram', 'details' => $response]);
}

function formatTelegramMessage($data) {
    $typeNames = [
        'bid' => 'Обеспечение заявки',
        'execution' => 'Исполнение контракта',
        'warranty' => 'Гарантийные обязательства',
        'advance' => 'Возврат аванса',
        'payment' => 'Гарантия платежа'
    ];

    $modeNames = [
        '44-fz' => '44-ФЗ',
        '223-fz' => '223-ФЗ',
        'commercial' => 'Коммерческий договор'
    ];

    $type = $typeNames[$data['guarantee_type']] ?? $data['guarantee_type'];
    $mode = $modeNames[$data['mode']] ?? $data['mode'];
    $sum = number_format($data['sum_bg'], 0, ',', ' ');
    $fee = number_format($data['calc']['fee'], 0, ',', ' ');
    $comment = !empty($data['contact']['comment']) ? "\n💬 " . $data['contact']['comment'] : '';

    return "🎯 <b>Новая заявка на банковскую гарантию</b>

<b>Компания:</b> " . ($data['company_name'] ?: 'Не указано') . "
<b>ИНН:</b> " . $data['inn'] . "

<b>Тип гарантии:</b> $type
<b>Режим:</b> $mode

<b>Срок:</b> " . $data['months'] . " мес. (" . $data['days'] . " дней)
<b>Сумма:</b> $sum ₽
<b>Комиссия:</b> $fee ₽

<b>Даты:</b> " . $data['date_start'] . " — " . $data['date_end'] . "

<b>Контакты:</b>
📞 " . $data['contact']['phone'] . "
📧 " . $data['contact']['email'] . "$comment

<b>Источник:</b> " . $data['lead_source'] . "
<b>Согласие на ПДн:</b> " . ($data['consent'] ? '✅' : '❌');
}
?>
