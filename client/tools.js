Tools = {
  capitalize(s){
    return s.replace(/^\w/, function (chr) {
      return chr.toUpperCase();
    });
  },
  pluralize(s){
    return s + 's';
  }
};