export const utilities = {
    generateGUID: function () {
      return (
        utilities.S4() +
        utilities.S4() +
        "-" +
        utilities.S4() +
        "-" +
        utilities.S4() +
        "-" +
        utilities.S4() +
        "-" +
        utilities.S4() +
        utilities.S4() +
        utilities.S4()
      );
    },
    S4: function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    rand: function (max) {
      return Math.floor(Math.random() * max);
    },
  };