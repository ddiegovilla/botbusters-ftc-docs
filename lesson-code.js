// Code is rendered as text nodes; copying retains the original source.
document.querySelectorAll('.java-highlight').forEach(code=>{
  const source=code.textContent;
  code.dataset.rawCode=source;
  const tokenPattern=/\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:package|import|static|public|private|protected|final|class|extends|abstract|return|new|void|boolean|double|enum|switch|case|break|true|false)\b|\b(?:Intake|Indexer|Robot|RobotOpMode|EctoMechanism|EctoButton|GamepadEx|Command|DcMotorEx|DcMotorSimple|Mode|BooleanSupplier|InterruptedBehavior|Scheduler|Telemetry|HardwareMap|OpMode|Config|Override)\b|\b\d+(?:\.\d+)?\b/g;
  const fragment=document.createDocumentFragment();
  source.split('\n').forEach((line,index)=>{
    const row=document.createElement('span');row.className='code-source-line';row.dataset.line=String(index+1);
    let end=0;
    for(const match of line.matchAll(tokenPattern)){
      row.append(document.createTextNode(line.slice(end,match.index)));
      const token=document.createElement('span');token.textContent=match[0];
      token.className=match[0].startsWith('//')?'syntax-comment':/^['"]/.test(match[0])?'syntax-string':/^\d/.test(match[0])?'syntax-number':/^[A-Z]/.test(match[0])?'syntax-type':'syntax-keyword';
      row.append(token);end=match.index+match[0].length;
    }
    row.append(document.createTextNode(line.slice(end)||' '));fragment.append(row);
  });
  code.replaceChildren(fragment);
});
