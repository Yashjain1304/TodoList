module.exports = getdate;

function getdate() {
  let dates = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = dates.toLocaleDateString("en-US", options);
  return day;
}
