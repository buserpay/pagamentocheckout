const MINUTES = 1;
const pixEmv = "00020101021126330014br.gov.bcb.pix0111073754464315204000053039865802BR5920WEIBSON S DOS SANTOS6006RECIFE62070503***63040D36";

let timeLeft = MINUTES * 60;
let interval = null;

$(function(){
  qr.init();
  qr.paymentTimeout();
});

let qr = {
  init: function() {
    this.create(pixEmv);
    $(`#chavePix`).on(`click`, function() {
      qr.copy();
    });
  },
  create: function(data) {
    const options = {
      width : 200, 
      height : 200
    };
    
    let qrcode = new QRCode(`qrcodePix`, options);
    qrcode.makeCode(data);
  
    $(`#chavePix`).val(data);
  },
  copy: function() {
    let pix = document.getElementById(`chavePix`);
    pix.select();
    document.execCommand("copy");
    pix.blur();
    
    alert(`Código copiado, abre o app do seu banco para realizar o pagamento`);
  },
  paymentTimeout: function() {
    let TOTALTIME = timeLeft;
    interval = setInterval(function() {
      let progressView = $(`.progress`);
      if (timeLeft > 0) {
        timeLeft -= 1;
        let result = qr.timeConvert(timeLeft);

        $(`#timer`).html(
          qr.leftpad(result.minutos, 2, '0')
          + ":" + 
          qr.leftpad(result.segundos, 2, '0')
        );
        let progress = timeLeft * 100 / TOTALTIME;
        console.log(progress);
        progressView
          .css(`width`, progress+'%')
          .css(`transition`, `width 0.5s ease`);
      } else {
        progressView.css(`width`, '0%');
        clearInterval(interval);
      }
    }, 1000);
  },
  timeConvert: function(segundos) {
    let minutos = Math.floor(segundos / 60);
    minutos %= 60;
    segundos %= 60;

    return { minutos, segundos };
  },
  leftpad: function(str, length, char) {
    str = String(str);
    padChar = char || ' ';

    while (str.length < length) {
        str = char + str;
    }

    return str;
  }
};