// Create our currency formatter.
var formatterCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0,
  //maximumFractionDigits: 0,
});

// Create our number formatter.
var formatter = new Intl.NumberFormat('pt-BR', {
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0,
  //maximumFractionDigits: 0,
});

function numberFormat(number)
{
    var temp = number;
  //var tabUnits = [" million", " billion", " trillion", " quadrillion", " quintillion", " sextillion", " septillion", " octillion", " nonillion", " decillion", " undecillion", " duodecillion", " tredecillion", " quattuordecillion", " quindecillion", " sexdecillion", " septendecillion", " octodecillion", " novemdecillion", " vigintillion", " unvigintillion", " duovigintillion", " tresvigintillion", " quattuorvigintillion", " quinquavigintillion", " sesvigintillion", " septemvigintillion", " octovigintillion", " novemvigintillion", " trigintillion", " untrigintillion", " duotrigintillion", " duotrigintillion", " trestrigintillion", " quattuortrigintillion", " quinquatrigintillion", " sestrigintillion", " septentrigintillion", " octotrigintillion", " noventrigintillion", " quadragintillion"];
  var tabUnits = ["K","M","B","T","aa","bb","cc","dd","ee","ff","gg","hh","ii","jj","kk","ll","mm","nn","oo","pp","qq","rr","ss","tt","uu","vv","ww","xx","yy","zz"];
  var highnumber = false;
  var bignumber = 1000;
  var tabposition = -1;
  var p_atomepersecond = true;
    var unit;
    if (number >= bignumber) {
        highnumber = true;
        while (number >= bignumber) { bignumber *= 1000; tabposition++; }
        //while (number >= bignumber && tabposition < 4 ) { bignumber *= 1000; tabposition++; }
        number /= (bignumber / 1000);
        unit = tabUnits[tabposition];
    } else unit = "";
    if (unit == undefined) return temp.toExponential(2);
    var toround = (highnumber == true) ? (p_atomepersecond == true) ? 100 : 100 : 10;
    var res = Math.round(number * toround) / toround;
    return res.toLocaleString().replace(",", ".") + '' + unit;
}

const formatNumber = (value, type) => {
  if (isNaN(value) || !value.toFixed) {
    return 0
  }

  if (type === 'currency') {
    return formatterCurrency.format(value.toFixed(2));
  }

  return numberFormat(value.toFixed(2));
}

export default (context, inject) => {
  inject('formatNumber', formatNumber)
}