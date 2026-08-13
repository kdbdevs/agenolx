(function(){
var W='https://multi-chat.info/go?i=agenolx';
var T='https://multi-chat.info/go-tg?i=agenolx';
function run(){
var a=document.querySelectorAll('a[href]');
for(var i=0;i<a.length;i++){
var h=a[i].getAttribute('href');
if(!h)continue;
var l=h.toLowerCase();
if(l.indexOf('multi-chat.info')>-1)continue;
if(l.indexOf('api.whatsapp.com/send')>-1||l.indexOf('wa.me/')>-1){a[i].setAttribute('href',W);continue}
if(l.indexOf('hokikale.me/wa')>-1||l.indexOf('yakale.me/wa')>-1||l.indexOf('prokale.me/wa')>-1||l.indexOf('yamantap.me/wa')>-1){a[i].setAttribute('href',W);continue}
if(l.indexOf('hokikale.me/agenolxtele')>-1||l.indexOf('hokikale.me/tele')>-1||l.indexOf('yakale.me/tele')>-1||l.indexOf('prokale.me/tele')>-1||l.indexOf('yamantap.me/tele')>-1){a[i].setAttribute('href',T);continue}
if(l.indexOf('telegram.me/agenolx')>-1||l.indexOf('t.me/agenolx')>-1){a[i].setAttribute('href',T)}
}
}
setTimeout(run,500);
setTimeout(run,1500);
setInterval(run,3000);
})();
