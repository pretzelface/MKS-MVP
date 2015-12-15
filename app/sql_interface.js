var sqlite3 = require('sqlite3');
var path = require('path')
var db = new sqlite3.Database(path.join(__dirname, '../db/creepster.sqlite'), function(err){
  if (err) console.log(err);
});
/* SCHEMA
CREATE TABLE "users" ("id" integer not null primary key autoincrement,
 "image_url" varchar(255),
  "name" varchar(255),
   "gender" varchar(255),
    "likes" integer default '0',
     "created_at" datetime,
      "updated_at" datetime);
CREATE UNIQUE INDEX users_name_unique on "users" ("name");
CREATE TABLE "likes" ("id" integer not null primary key autoincrement,
 "to_user" varchar(255),
  "from_user" varchar(100),
   "value" integer, "created_at" datetime,
    "updated_at" datetime);
CREATE TABLE "messages" ("id" integer not null primary key autoincrement,
 "to_user" varchar(255),
  "from_user" varchar(255),
   "text" varchar(255),
    "created_at" datetime,
     "updated_at" datetime);
*/

exports.getAll = function(callback){
  db.all('select * from users', function(err,rows){
    if (err) {console.log(err);}
    else {
      callback(rows);
    }
  });
}

exports.addUser = function(user,callback){
  db.get('select * from users where name like $name',{$name:user.username},function(err,row){
    console.log(row)
    if (!row){
      db.run("insert into users (image_url, name, gender, likes) values ($url, $name, $gender, $likes)",{
        $url: user.url,
        $name: user.username,
        $gender: user.gender,
        $likes: user.likes
      }, function(err){
        if (err) console.log(err);
      });
    } else {
      db.run("update users set image_url = $url where name = $name",{
        $url: user.url,
        $name: user.username,
        //We'll allow users to keep their likes even if they switch their photo.
      })
    }
    callback();
  });
}

exports.addLike = function(like,callback){
  db.run("insert into likes (from_user, to_user, value) values ($from, $to, $val)",{
    $from: like.fromUser,
    $to: like.toUser,
    $val: like.value
  }, function(err){
    if (err) {console.log(err)}
    else db.all("select value from likes where to_user = $to",{$to:like.toUser},function(err,rows){
      likeCount = 0;
      for (var i = 0;i<rows.length;i++){
        likeCount += rows[i].value;
      }
      //unclear why reduce doesn't work here. It doesn't like arrays of objects.
      db.run("update users set likes = $val where name = $name",{
        $val : likeCount,
        $name : like.toUser
      }, function(){callback()})
    });
  });
}