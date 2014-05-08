<?php
require_once('markdown.php');
require_once('topy.php');


//scanfiles
$dir = "../mdfile/";

$files = scandir($dir);

$fileArr = array();

foreach($files as $file){
    if($file == "." || $file == "..") continue;


    if(stripos($file, "swp") > 0) continue;

    $tmp = explode("-", $file);

    if($tmp[1]){
        $fileArr[$tmp[1]] = $file;
    }
}

krsort($fileArr);

$result = array("list" => array());

foreach($fileArr as $key => $val){
    $time = str_replace(".md", "", $key);
    $title = str_replace("-" . $key, "", $val);

    $file = file_get_contents($dir . $val);

    $pName = $PY->get($title, "gb2312");

    $id = uniqid();

    $brief_str = substr($file, 0, 150) . "..";

    $mks = Markdown($file);

    $list = array(
        "title" => iconv("gb2312", "utf-8", $title),
        "pubtime" => $time,
        "brief" => Markdown($brief_str),
        "id" => $id,
        "pName" => $pName
    );

    $result['list'][] = $list;

    make_article($file, $pName);
}

$fileContent = json_encode($result);
if(file_put_contents("../data/content.json", $fileContent)){
    echo "make list OK<br />";
}

function make_article($file_content, $name){
    $mks = Markdown($file_content);

    $fileName = "../data/$name.json";

    $list = array(
        "content" => $mks
    );

    $fileContent = json_encode($list);

    if(file_put_contents($fileName, $fileContent)){
        echo "<span style='color: green;'>mkfile: $name, OK</span><br />";
    }else{
        echo "<span style='color: red;'>mkfile: $name, Error</span><br />";
    }

}
//$data = Markdown(file_get_contents("../mdfile/test.md"));
