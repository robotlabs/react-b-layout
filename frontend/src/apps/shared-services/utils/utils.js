const Utils = {
  parseDate(d) {
    let frag = d.split('T');
    if (!frag[1]) {
      return frag;
    }
    frag = frag[0].split('-').concat(frag[1].split(':'));
    frag = frag.map((v, i) => {
      return Number(v) - (i === 1 ? 1 : 0);
    });
    let ts = new Date(Date.UTC(...frag));
    let offset = (new Date()).getTimezoneOffset();
    let adjTs = new Date(ts.getTime() - offset * 60000);
    let day = adjTs.getDate();
    let month = adjTs.getMonth() + 1;
    let dateParsed = day + '-' + month;
    return dateParsed;
  }
};
export default Utils;
