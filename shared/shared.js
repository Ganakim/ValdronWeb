Cards = new Mongo.Collection('cards');
Decks = new Mongo.Collection('decks');
Sets = new Mongo.Collection('sets');
Effects = new Mongo.Collection('effects');
Habitats = new Mongo.Collection('habitats');
LocalDeck = new Mongo.Collection('localDeck');
PrintDeck = new Mongo.Collection('printDeck');

Columns = {
  Decks:Decks,
  LocalDeck:LocalDeck,
  PrintDeck:PrintDeck,
  Effects:Effects,
  Cards:Cards,
  Habitats:Habitats,
  Sets:Sets
};