var UserView = Backbone.View.extend({
  render: function(){
    var $userDiv = $('<div class="user"></div>');
    var $userSpan = $('<span class="username"></span>');
    var $attrDiv = $('<div class="userattributes"></div>')
    var $genderSpan = $('<span class="gender"></span>');
    if (this.model.attributes.gender){
      $genderSpan.text(this.model.attributes.gender === 'male' ? 'Male' : 'Female');
     // console.log(this.model.attributes.confidence)
    } else $genderSpan.text('Bad Picture or Ugly Subject');
    $attrDiv.append($genderSpan);
    var $userImg = $('<img class="userpic">');
    //console.log(this.model.attributes);
    $userImg.attr('src',this.model.attributes.image_url);
    $userSpan.text(this.model.attributes.name);
    $userDiv.append($userSpan).append($attrDiv).append($userImg);
    this.$el.html($userDiv);
    return this;
  }
});