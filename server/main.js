import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
var fs = Npm.require('fs');
var path = require('path');

var admins = ['d9PY8JSqSkfNMzj66'];

Meteor.startup(()=>{
  for(var dir of fs.readdirSync(path.join(`${process.env['PWD']}/imports`))){
    for(var part of fs.readdirSync(path.join(`${process.env['PWD']}/imports/${dir}`))){
      var currentMain = fs.readFileSync(`${process.env['PWD']}/client/main.js`, 'utf8');
      if(!currentMain.includes(`import \'/imports/${dir}/${part}/${part}.js\';`) && part !== 'New Folder'){
        fs.writeFileSync(`${process.env['PWD']}/client/main.js`, currentMain.replace('//IMPORTS//', `//IMPORTS//\nimport \'/imports/${dir}/${part}/${part}.js\';`));
      }
      if(!fs.readFileSync(process.env['PWD'] + `/imports/${dir}/${part}/${part}.html`, 'utf8')){
        fs.writeFileSync(process.env['PWD'] + `/imports/${dir}/${part}/${part}.html`, `<template name=\"${part}\">\n\t<div>\n\t\t${part} Template!\n\t</div>\n</template>`);
      }
      if(!fs.readFileSync(process.env['PWD'] + `/imports/${dir}/${part}/${part}.js`, 'utf8')){
        fs.writeFileSync(process.env['PWD'] + `/imports/${dir}/${part}/${part}.js`, `import \'./${part}.html\';\nimport \'./${part}.css\';`);
      }
    }
  }
});

Meteor.publish('User', function(){
  return Meteor.users.find(this.userId);
});
Meteor.publish('Cards', ()=>{
  return Cards.find();
});
Meteor.publish('Effects', ()=>{
  return Effects.find();
});
Meteor.publish('Habitats', ()=>{
  return Habitats.find();
});
Meteor.publish('Sets', ()=>{
  return Sets.find();
});
Meteor.publish('LocalDeck', ()=>{
  return LocalDeck.find();
});
Meteor.publish('PrintDeck', ()=>{
  return PrintDeck.find();
});
Meteor.publish('Decks', function(){
  if(admins.includes(this.userId)){
    return Decks.find()
  }else if(this.userId){
    return Decks.find({owner:this.userId}, {many:true});
  }
});

Meteor.users.deny({
  update:()=>{
    return true;
  }
});
for(var col in Columns){
  Columns[col].deny({
    update:()=>{
      return true;
    }
  });
}

var deck = []

Meteor.methods({
  create(col, item){
    Columns[col].insert(item);
  },
  update(col, change){
    Columns[col.type].update(col.selector, change, (err)=>{
      if(err){
        console.log(err);
      }
    });
  },
  remove(col){
    Columns[col.type].remove(col.selector);
    if(col.type === "Decks"){
      Meteor.users.update(Meteor.userId(), {$pull:{'profile.decks':col.selector}});
    }
  },
  newDeck(){
    return Decks.insert({owner:Meteor.userId(), name:'New Deck', cards:[]}, (err, res)=>{
      if(err){
        console.log(err);
      }
      Meteor.users.update(Meteor.userId(), {$push:{'profile.decks':res}});
    });
  },
  getEmail(userId){
    return Meteor.users.findOne(userId).emails[0].address;
  },
  getStuffPls(){
    HTTP.get('https://sheets.googleapis.com/v4/spreadsheets/1kgPTew51wWFuwZqZEwL1DxP_C6Go980p864Y3-8K-JM/values/DesiredCards!A3:N9999', {
      params:{
        key:'AIzaSyCQQCIP6YofSnjLG2xtAsG41alJ78I66Ek',
        majorDimension:'ROWS'
      }
    }, (err, res)=>{
      if(err){
        console.log(err)
      }
      if(res.data.values){
        PrintDeck.remove({})
        for(var card of res.data.values){
          for(var i=0;i<card[0];i++){
            var localEffects = []
            if(card[11]){
              localEffects.push(Effects.findOne({name: card[11]}))
            }
            if(card[12]){
              localEffects.push(Effects.findOne({name: card[12]}))
            }
            PrintDeck.insert({
              name:card[4],
              mutation:card[6],
              habitat:Habitats.findOne({name:card[3]})._id,
              picture:'',
              power:card[7],
              retaliation:card[8],
              toughness:card[9],
              sludgeCost:card[13],
              set:Sets.findOne({name:card[2]})._id,
              rarity:card[5],
              effects:localEffects,
              description:''
            })
          }
        }
      }
    })
  },
  genDeck(habitat, mutation, quantity){
    LocalDeck.remove({})
    HTTP.get('https://sheets.googleapis.com/v4/spreadsheets/182ZAWsAduup5C8kTYpeR9vVIbTFWgmRKjoaiRGOscN4/values/!A1:g30', {
      params:{
        key:'AIzaSyCQQCIP6YofSnjLG2xtAsG41alJ78I66Ek',
        //majorDimension:'ROWS'
      }
    }, (err, res)=>{
      if(err){
        console.log(err)
      }
      //weights
      HTTP.get('https://sheets.googleapis.com/v4/spreadsheets/1fzpnHCRaKgo_sIJfBOCVBoTgljNwMtE0HxR_Id_Hwsg/values/!A1:B9999', {
        params:{
          key:'AIzaSyCQQCIP6YofSnjLG2xtAsG41alJ78I66Ek',
          majorDimension:'COLUMNS'
        }
      }, (err, res)=>{
        if(err){
          console.log(err)
        }
        //names
        var names = res.data.values[0];
        var usedNames = res.data.values[1];
        for(var name of usedNames){
          names.splice(names.indexOf(name),1)
        }
        HTTP.get('https://sheets.googleapis.com/v4/spreadsheets/182ZAWsAduup5C8kTYpeR9vVIbTFWgmRKjoaiRGOscN4/values/!B3:G30',{
          params:{
            key:'AIzaSyCQQCIP6YofSnjLG2xtAsG41alJ78I66Ek',
            majorDimension:'COLUMNS'
          }
        }, (err, res)=>{
          var prtInfo = {
            Desert:res.data.values[0],
            Glacier:res.data.values[1],
            Cavern:res.data.values[2],
            Summit:res.data.values[3],
            Ocean:res.data.values[4],
            Forest:res.data.values[5]
          }
          prtInfo = prtInfo[habitat]
          function genName(){
            var name = names[Math.floor(Math.random()*names.length)]
            names.splice(names.indexOf(name),1)
            usedNames.push(name)
            return name
          }
          function hasEffect(){
            var a = Math.random()
            return a <= prtInfo[(mutation*2)+16] ? (a <= prtInfo[(mutation*2)+17] ? 'Has 2 effects!' : 'Has an effect!') : ''
          }
          for(var i=0;i<quantity;i++){
            var P = Math.floor(Math.random() * (((100-Number(prtInfo[16]))-Number(prtInfo[17])) - Number(prtInfo[15]) + 1)) + Number(prtInfo[15]),
            R = Math.floor(Math.random() * ((100 - P-Number(prtInfo[17])) - Number(prtInfo[16]) + 1)) + Number(prtInfo[16]),
            T = 100 - P - R,
            Pt = Math.round((P*prtInfo[((mutation-1)*3)])/5)*5,
            Rt = Math.round((R*prtInfo[((mutation-1)*3)+1])/5)*5,
            Tt = Math.round((T*prtInfo[((mutation-1)*3)+2])/5)*5
            var localCard = {
              name:genName(),
              effects:hasEffect(),
              mutation:mutation,
              habitat:Habitats.findOne({name:habitat})._id,
              picture:'',
              power:Pt,
              retaliation:Rt,
              toughness:Tt,
              set:'7ddYZnk8YZLHntjiD',
              rarity:'1',
              description:''
            }
            LocalDeck.insert(localCard)
            //localDeck.push(localCard)
          }
          //return localDeck
        })
      })
    })
  },
});