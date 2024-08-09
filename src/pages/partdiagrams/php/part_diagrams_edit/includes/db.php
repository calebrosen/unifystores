<?php


ob_start();
header("Access-Control-Allow-Origin: *"); //add this CORS header to enable any domain to send HTTP requests to these endpoints:
header("Access-Control-Allow-Headers: *");

$host = "10.1.10.186";
$user = "caleb";
$password = ")GVGKqESUtr+";
$dbname = "unify";
$port = "3306";

$connection = mysqli_connect($host, $user, $password, $dbname, $port);

global $website; // change website for different site
$website = "localhost";

function get_website() : string {
    return "localhost";
  }


?>
