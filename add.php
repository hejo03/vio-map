<?php
$id = $_POST['id'];
$title = $_POST['title'];
$category = $_POST['category'];
$notes = $_POST['notes'];
$position = $_POST['position'];
$posObj = json_decode($position);

$lat = $posObj->lat;
$lng = $posObj->lng;


echo "adding..";

$file = file_get_contents('./locations.json', true);
$data = json_decode($file, true);
unset($file);
//you need to add new data as next index of data.
$data[] = array('id' => (int)$id, 'type' => $category, 'title' => $title,  'notes' => $notes, 'lat' => (float)$lat, 'lng' => (float)$lng);
$result = json_encode($data);
file_put_contents('./locations.json', $result);
unset($result);

echo "Added to list! bye";
header("refresh:2;url=config.php");
