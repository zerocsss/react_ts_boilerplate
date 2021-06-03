function myNew(Obj, ...args) {

  let obj = {};

  obj.__proto__ = Obj.prototype;

  let res = Obj.apply(obj, args);

  console.log('-=-=',res)

  return res instanceof Object ? res : obj;
  
}

