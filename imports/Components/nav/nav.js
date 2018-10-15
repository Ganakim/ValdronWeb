import './nav.html';
import './nav.css';

Session.set('nav', 'semi')

var navBtns = [
  {text:'Battle', path:'battle'},
  {text:'Decks', path:'deck'},
  {text:'Trade', path:'trade'},
  {text:'Shop', path:'shop'},
];
Template.nav.helpers({
  navBtns(){
    return navBtns;
  },
});

Template.nav.events({
  'click .navBtns .btn': function(){
    if($(`#${this.path}NavBtn`).hasClass('btn-dark')){
      $('.navBtns .btn').removeClass('btn-dark');
      $(`#${this.path}NavBtn`).text(this.text);
      Session.set('content', 'landing');
    }else{
      if($('.navBtns .btn-dark')[0]){
        $('.navBtns .btn-dark').text(navBtns.filter(btn=>btn.path == $('.navBtns .btn-dark').attr('id').replace('NavBtn', ''))[0].text);
      }
      $('.navBtns .btn').removeClass('btn-dark');
      $(`#${this.path}NavBtn`).addClass('btn-dark');
      $(`#${this.path}NavBtn`).text(' Back');
      if(Template[this.path]){
        Session.set('content', this.path);
      }else{
        Session.set('content', '404');
      }
    }
  },
  'mouseenter .navBtns':function(){
    $('.navBtns').removeClass('semi', 400, ()=>{
      Session.set('nav', 'true')
      // $(window).resize(Resize);
    });
  },
  'mouseleave .navBtns':function(){
    $('.navBtns').addClass('semi', 400, ()=>{
      Session.set('nav', 'semi')
      // $(window).resize(Resize);
    });
  },
})