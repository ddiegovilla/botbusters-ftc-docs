const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const storage = {get(key, fallback) {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}},set(key, value) {try {localStorage.setItem(key, JSON.stringify(value));} catch {}}};
const sections = {instalacion:[['android-studio','Android Studio'],['java','Java / JDK'],['adb','ADB']],setup:[['cuenta','Tu cuenta en GitLab'],['acceso','Acceso al equipo'],['repositorio','Clonar el repositorio'],['rama','Rama de trabajo']],codigo:[['donde-corre','Dónde se ejecuta'],['mapa-proyecto','Mapa del proyecto'],['piezas-codigo','Las piezas principales'],['robot-mecanismos','Robot y mecanismos'],['robotopmode','RobotOpMode'],['ciclo-opmode','Ciclo de un OpMode'],['integrar-mecanismo','Integrar un mecanismo'],['boton-motor','Del botón al motor'],['por-donde-empezar','Por dónde empezar'],['probar-cambios','Compilar y probar']],chasis:[['chasis-pedro', 'La base de Pedro'], ['chasis-odometria','Odometría'],['chasis-archivos', 'Archivos del chasis'], ['chasis-opmode', 'Conexión al OpMode'], ['chasis-teleop', 'TeleOp'], ['chasis-autonomo', 'Autónomo'], ['chasis-constants', 'Constants'], ['chasis-tuning', 'Tuning'], ['chasis-diagnostico', 'Diagnóstico'], ['chasis-cambios', 'Qué cambiar']],intake:[['intake-crear', 'Crear clase y carpeta'], ['intake-motor', 'Motor y estados'], ['intake-periodic', 'Actualización periódica'], ['intake-comandos', 'Comandos'], ['intake-default', 'Recolección y expulsión'], ['intake-robot', 'Agregar a Robot'], ['intake-opmode', 'Agregar a RobotOpMode'], ['intake-teleop', 'TeleOp de prueba']],indexer:[["indexer-crear", "Crear clase y carpeta"], ["indexer-motor", "Motor y estados"], ["indexer-periodic", "Actualización periódica"], ["indexer-comandos", "Comandos básicos"], ["indexer-shoot", "Comando shoot"], ["indexer-robot", "Agregar a Robot"], ["indexer-opmode", "Agregar a RobotOpMode"], ["indexer-teleop", "TeleOp de prueba"]]};
const pageIds={instalacion:'installation-page',setup:'setup-page',codigo:'code-page',chasis:'chassis-page',intake:'intake-page',indexer:'indexer-page'};
const pageTitles={instalacion:'Instalación',setup:'Setup',codigo:'Conoce el código',chasis:'Chasis',intake:'Intake',indexer:'Indexer'};
let page = 'instalacion';
let scrollFrame;
function closeMenu(){$('#sidebar').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}
function updateActiveSection(){
  const currentSections=sections[page];
  const threshold=Math.max(120,Math.min(220,window.innerHeight*0.3));
  let active=currentSections[0][0];
  for(const [id] of currentSections){if(document.getElementById(id).getBoundingClientRect().top<=threshold)active=id;}
  if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-4)active=currentSections.at(-1)[0];
  all('[data-subnav] a').forEach(link=>{const current=link.getAttribute('href')===`#${page}/${active}`;link.classList.toggle('current',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
function route(){
  const [target,section]=(location.hash.slice(1)||'instalacion').split('/');
  page=Object.hasOwn(pageIds,target)?target:'instalacion';
  all('.doc-page').forEach(article=>article.hidden=article.id!==pageIds[page]);
  all('[data-page]').forEach(a=>{const active=a.dataset.page===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  all('[data-subnav]').forEach(nav=>nav.hidden=nav.dataset.subnav!==page);
  document.title=`${pageTitles[page]} · Botbusters Docs`;
  closeMenu();
  requestAnimationFrame(()=>{if(section&&sections[page].some(([id])=>id===section))document.getElementById(section).scrollIntoView();else window.scrollTo(0,0);updateActiveSection();});
}
window.addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=null;updateActiveSection();});},{passive:true});
window.addEventListener('resize',updateActiveSection);
window.addEventListener('hashchange',route);route();
$('#menu').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(!$('#sidebar').contains(e.target)&&!$('#menu').contains(e.target))closeMenu();});
function setTheme(theme){document.documentElement.dataset.theme=theme;$('#theme').setAttribute('aria-label',theme==='dark'?'Activar modo claro':'Activar modo oscuro');storage.set('botbusters-theme',theme);}
setTheme(storage.get('botbusters-theme','light'));
$('#theme').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
const steps=[
 ['Desde Home, entra a Groups','En el menú izquierdo de GitLab, selecciona Groups para ver los grupos a los que tienes acceso.','Home de GitLab con la opción Groups en el menú izquierdo.','GitLab'],
 ['Abre el grupo Botbusters','En la lista de grupos, haz clic en Botbusters. Si no aparece, confirma con tu mentor que ya tienes acceso.','Lista de grupos de GitLab con el grupo Botbusters.','GitLab'],
 ['Entra al subgrupo FTC','Dentro de Botbusters, busca y abre FTC en la lista de subgrupos.','Grupo Botbusters con el subgrupo FTC en la lista.','GitLab'],
 ['Selecciona la temporada 2026–2027','Abre FTC-Botbusters 2026-2027. Ese es el repositorio del equipo que vamos a clonar.','Subgrupo FTC con el proyecto FTC-Botbusters 2026-2027.','GitLab'],
 ['Abre el menú Code','Ya dentro del repositorio, localiza el botón Code, encima de la lista de archivos, y ábrelo.','Repositorio FTC-Botbusters 2026-2027 con el botón Code.','GitLab'],
 ['Copia Clone with HTTPS','En el menú Code, usa el botón de copiar de Clone with HTTPS. Elige HTTPS para este proceso.','Menú Code abierto y la opción Clone with HTTPS con su botón de copiar.','GitLab'],
 ['Abre Clone Repository','Inicia Android Studio. En la pantalla de bienvenida, selecciona Clone Repository.','Pantalla de bienvenida de Android Studio con el botón Clone Repository.','Android Studio'],
 ['Pega el enlace y clona','Con Git seleccionado, pega el enlace HTTPS en URL, elige la carpeta de destino y presiona Clone. Después, sigue los pasos de la pantalla.','Diálogo Clone Repository de Android Studio con la URL HTTPS del equipo y el botón Clone.','Android Studio']
];
let step=0;
steps.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Paso ${i+1}: ${item[0]}`);button.addEventListener('click',()=>showStep(i));$('#step-tabs').append(button);});
function showStep(i){step=i;const [title,description,alt,kind]=steps[i];$('#step-title').textContent=title;$('#step-description').textContent=description;$('#step-image').src=`assets/step-${i+1}.png`;$('#step-image').alt=alt;$('#step-counter').textContent=`${i+1} / 8`;$('#step-kind').textContent=kind;$('#prev-step').disabled=i===0;$('#next-step').disabled=i===7;all('#step-tabs button').forEach((b,j)=>{if(j===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
showStep(0);
$('#prev-step').addEventListener('click',()=>showStep(Math.max(0,step-1)));
$('#next-step').addEventListener('click',()=>showStep(Math.min(7,step+1)));
$('#expand-image').addEventListener('click',()=>{$('#full-image').src=$('#step-image').src;$('#full-image').alt=steps[step][2];$('#image-dialog-title').textContent=steps[step][0];$('#image-dialog').showModal();});
$('#close-image').addEventListener('click',()=>$('#image-dialog').close());
all('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
all('[data-os]').forEach(button=>button.addEventListener('click',()=>{all('[data-os]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));$('#adb-code').textContent=button.dataset.os==='windows'?'.\\adb.exe version':'./adb version';$('#adb-command').setAttribute('aria-labelledby',button.id);}));
async function copyText(id,button){const el=document.getElementById(id);const text=el.dataset.rawCode??el.textContent;const originalLabel=button.textContent;try{await navigator.clipboard.writeText(text);button.textContent='Copiado';$('#status').textContent='Texto copiado al portapapeles.';setTimeout(()=>button.textContent=originalLabel,1800);}catch{const range=document.createRange();range.selectNodeContents(document.getElementById(id));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);button.textContent='Seleccionado';$('#status').textContent='Texto seleccionado. Usa el comando Copiar de tu dispositivo.';setTimeout(()=>button.textContent=originalLabel,2500);}}
all('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText(b.dataset.copy,b)));
const searchItems=[{title:'Instalación',description:'Prepara las herramientas de programación.',url:'#instalacion',terms:'herramientas instalar computadora'},{title:'Android Studio',description:'Descargar e instalar el entorno de desarrollo.',url:'#instalacion/android-studio',terms:'ide sdk descargar instalación'},{title:'Java / JDK',description:'Prepara Java para compilar el proyecto.',url:'#instalacion/java',terms:'jdk jbr lenguaje runtime gradle'},{title:'ADB',description:'Instala Android SDK Platform-Tools.',url:'#instalacion/adb',terms:'conectar robot bridge terminal platform tools windows mac linux'},{title:'Cuenta de GitLab',description:'Regístrate con tu correo institucional.',url:'#setup/cuenta',terms:'registro correo cuenta gitlab'},{title:'Acceso al equipo',description:'Comparte tu correo por WhatsApp con tu mentor.',url:'#setup/acceso',terms:'whatsapp grupo invitación permisos botbusters'},{title:'Clonar el repositorio',description:'GitLab · HTTPS · Clone Repository en Android Studio.',url:'#setup/repositorio',terms:'setup código git clone 2026 2027 proyecto repositorio https'}];
searchItems.push(
{"title": "Construye el indexer", "description": "Motor, estados y comandos paso a paso.", "url": "#indexer", "terms": "mecanismo crear indexer ectomechanism"},{"title": "Comando shoot", "description": "Alimentar con el indexer mientras mantienes cruceta arriba.", "url": "#indexer/indexer-shoot", "terms": "dpad up boolean supplier held on off disparar"},{"title": "Agregar Indexer a Robot", "description": "Import, campo y construcción sin quitar Intake ni chasis.", "url": "#indexer/indexer-robot", "terms": "instancia robot indexer constructor"},{"title": "Indexer en RobotOpMode", "description": "Conservar los tres periódicos y el procesamiento común.", "url": "#indexer/indexer-opmode", "terms": "scheduler schedule periodic indexer"},{"title": "TeleOp del indexer", "description": "Modo de prueba y ejemplo con chasis e intake.", "url": "#indexer/indexer-teleop", "terms": "ectobutton shoot control gamepad integrar mecanismos"},{"title": "Compilar y probar", "description": "Instalar TeamCode y seleccionar tu OpMode en Driver Station.", "url": "#codigo/probar-cambios", "terms": "run instalar build gradle error disabled emulador hardware configuracion prueba"},
 {title:'Rama de trabajo',description:'Trabaja en monterreyRegional desde Android Studio.',url:'#setup/rama',terms:'branch checkout fetch git rama monterreyregional'},
 {title:'Odometría',description:'Dos dead wheels y Pinpoint para estimar la pose del chasis.',url:'#chasis/chasis-odometria',terms:'pods encoder ruedas muertas imu odometria'},
 {title:'Construye el intake',description:'Tutorial paso a paso con código copiable y explicaciones por línea.',url:'#intake',terms:'mecanismo intake crear motor ectomechanism timeline'},
 {title:'Crear la clase Intake',description:'Carpeta, package, clase y constructor.',url:'#intake/intake-crear',terms:'nombre mayusculas minusculas import extends constructor'},
 {title:'Motor y estados del intake',description:'DcMotorEx, hardwareMap y estados ON, OFF y REVERSE.',url:'#intake/intake-motor',terms:'motorid potencias direccion fields config'},
 {title:'Comandos del intake',description:'Crear órdenes de encendido, apagado y expulsión.',url:'#intake/intake-comandos',terms:'instant requiring comando on off reverse toggle'},
 {title:'Registrar intake en Robot',description:'Dónde van el import, el campo y el constructor.',url:'#intake/intake-robot',terms:'agregar instancia intake robot clase variable'},
 {title:'Programar intake en RobotOpMode',description:'Agregar periodic y conservar scheduler y botones.',url:'#intake/intake-opmode',terms:'ectobutton helper button periodic super loop schedule'},
 {title:'TeleOp del intake',description:'De un modo vacío a START y el botón Y.',url:'#intake/intake-teleop',terms:'teleop prueba control gamepad outtake ispressed'},
 {title:'Chasis',description:'Mecanismos: EctoMecanum, Pedro Pathing, TeleOp y autónomo.',url:'#chasis',terms:'chassis mecanum drivetrain follower movimiento'},
 {title:'Archivos del chasis',description:'Dónde encontrar EctoMecanum, Constants, rutas y tuners.',url:'#chasis/chasis-archivos',terms:'robotopmode robot paths tuning java files'},
 {title:'Chasis en TeleOp',description:'Controles, field-centric, alianza y pose inicial.',url:'#chasis/chasis-teleop',terms:'sticks gamepad mecanum driveorhold heading grados radianes offset pose'},
 {title:'Chasis en autónomo',description:'Cómo programar y encadenar rutas con el mismo chasis.',url:'#chasis/chasis-autonomo',terms:'paths auto followpath schedule then secuencia'},
 {title:'Constants del chasis',description:'Motores, Pinpoint, Foresight y creación del follower.',url:'#chasis/chasis-constants',terms:'constantes hardwaremap lf rf lb rb direccion offsets localizerconfig drivetrainconfig foresightconfig'},
 {title:'Tuning del chasis',description:'Orden de ajuste y enlaces a la documentación oficial de Pedro.',url:'#chasis/chasis-tuning',terms:'tunear calibrar autotune mecanumtuner pinpoint foresight tuner tests'},
 {title:'Diagnóstico del chasis',description:'Qué revisar si falla el manejo, la pose o una trayectoria.',url:'#chasis/chasis-diagnostico',terms:'problemas errores fallas no gira init oscila drift distancia'},
 {title:'Qué cambiar en el chasis',description:'Ubica la configuración que corresponde a cada cambio.',url:'#chasis/chasis-cambios',terms:'modificar ajustes nombres controles rutas montaje'},
 {title:'Robot y mecanismos',description:'Campos, constructor, hardwareMap y referencias a los mecanismos.',url:'#codigo/robot-mecanismos',terms:'robot java crear instancia declarar construir intake hardware telemetria'},
 {title:'RobotOpMode',description:'Inicialización compartida, botones, scheduler y llamadas super.',url:'#codigo/robotopmode',terms:'herencia extends super init loop periodic schedule programar base'},
 {title:'Integrar un mecanismo',description:'Conectar su clase, su instancia, su periódico y sus acciones.',url:'#codigo/integrar-mecanismo',terms:'agregar nuevo mecanismo robot robotopmode off estado comandos periodic constructor'},
 {title:'Conoce el código',description:'Cómo se organiza y ejecuta el programa del robot.',url:'#codigo',terms:'contexto fundamentos arquitectura java robot teleop'},
 {title:'Mapa del proyecto',description:'TeamCode y las carpetas del equipo.',url:'#codigo/mapa-proyecto',terms:'archivos carpetas robotopmodes mechanisms commands pedro'},
 {title:'Las piezas principales',description:'Robot, RobotOpMode, mecanismos y comandos.',url:'#codigo/piezas-codigo',terms:'scheduler hardwaremap telemetria ivy ftclib dashboard'},
 {title:'Ciclo de un OpMode',description:'INIT, START, LOOP y STOP.',url:'#codigo/ciclo-opmode',terms:'init_loop periodic super loop ejecucion'},
 {title:'Del botón al motor',description:'Sigue una pulsación de Y hasta el intake.',url:'#codigo/boton-motor',terms:'ectobutton comando reverse on off intake outtake'},
 {title:'Por dónde empezar',description:'Una primera ruta de lectura del código.',url:'#codigo/por-donde-empezar',terms:'redcompteleop archivos leer'}
);
function normalize(s){return s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function search(){const words=normalize($('#search-input').value).trim().split(/\s+/);const items=searchItems.filter(item=>words.every(word=>normalize(item.title+' '+item.description+' '+item.terms).includes(word)));const list=$('#search-results');list.replaceChildren();if(!items.length){const p=document.createElement('p');p.textContent='No encontramos ese tema. Prueba con “Java”, “ADB” o “GitLab”.';list.append(p);}items.forEach(item=>{const a=document.createElement('a');a.href=item.url;const title=document.createElement('span');title.textContent=item.title;const small=document.createElement('small');small.textContent=item.description;a.append(title,small);a.addEventListener('click',()=>{$('#search-dialog').close();if(location.hash===item.url)route();});list.append(a);});}
function openSearch(){$('#search-dialog').showModal();$('#search-input').value='';search();$('#search-input').focus();}
$('#open-search').addEventListener('click',openSearch);$('#close-search').addEventListener('click',()=>$('#search-dialog').close());$('#search-input').addEventListener('input',search);$('#search-input').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();$('#search-results a')?.focus();}if(e.key==='Enter')$('#search-results a')?.click();});document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if($('#search-dialog').open)$('#search-dialog').close();else openSearch();}if(e.key==='Escape')closeMenu();});

$('.skip').addEventListener('click',e=>{e.preventDefault();$('#content').focus();$('#content').scrollIntoView();});

// A repeated navigation link should still return to its section.
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(link&&link.getAttribute('href')===location.hash&&link.getAttribute('href')!=='#content'){event.preventDefault();route();}});

all('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  $('#full-image').src=button.dataset.preview;
  $('#full-image').alt=button.dataset.caption;
  $('#image-dialog-title').textContent=button.dataset.caption;
  $('#image-dialog').showModal();
}));
