const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, Footer, TabStopType, SimpleField
} = require('docx');
const fs = require('fs');

const NAVY="1F3864",TEAL="2E75B6",LTBLUE="D6E4F0",LTGRAY="F2F2F2",
      WHITE="FFFFFF",MGRAY="595959",DGRAY="404040",
      GREEN="1D6F42",LTGREEN="EDF7EE",
      RED="8B1A1A",LTRED="FDECEA",
      PURPLE="3D1A6E",LTPURPLE="F4EDF9";

const nb={style:BorderStyle.NONE,size:0,color:"FFFFFF"};
const noBorders={top:nb,bottom:nb,left:nb,right:nb};
const thin={style:BorderStyle.SINGLE,size:2,color:"CCCCCC"};
const thinBorders={top:thin,bottom:thin,left:thin,right:thin};

const sp=(pt=6)=>new Paragraph({spacing:{line:pt*20},children:[new TextRun("")]});
const secHead=text=>new Paragraph({
  spacing:{before:280,after:80},
  border:{bottom:{style:BorderStyle.SINGLE,size:8,color:TEAL,space:4}},
  children:[new TextRun({text,bold:true,size:24,color:NAVY,font:"Arial"})]
});
const body=(text,extra={})=>new Paragraph({
  spacing:{before:30,after:50},
  children:[new TextRun({text,size:19,color:DGRAY,font:"Arial",...extra})]
});
const cell=(children,width,fill=WHITE,opts={})=>new TableCell({
  borders:noBorders,shading:{fill,type:ShadingType.CLEAR},
  margins:{top:80,bottom:80,left:120,right:120},
  width:{size:width,type:WidthType.DXA},...opts,children
});
const hdr=(text,width)=>new TableCell({
  borders:noBorders,shading:{fill:NAVY,type:ShadingType.CLEAR},
  margins:{top:90,bottom:90,left:120,right:120},
  width:{size:width,type:WidthType.DXA},
  children:[new Paragraph({children:[new TextRun({text,bold:true,size:18,color:WHITE,font:"Arial"})]})]
});
const ptsTag=pts=>new TableCell({
  borders:noBorders,shading:{fill:LTBLUE,type:ShadingType.CLEAR},
  margins:{top:90,bottom:90,left:120,right:120},
  width:{size:1600,type:WidthType.DXA},
  children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:pts,bold:true,size:20,color:TEAL,font:"Arial"})]})]
});
const writeBox=(label,hint="")=>new Table({
  width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
  rows:[
    new TableRow({children:[new TableCell({
      borders:noBorders,shading:{fill:LTBLUE,type:ShadingType.CLEAR},
      margins:{top:80,bottom:80,left:140,right:140},
      children:[new Paragraph({children:[new TextRun({text:label,bold:true,size:19,color:NAVY,font:"Arial"})]})]
    })]}),
    new TableRow({children:[new TableCell({
      borders:{top:{style:BorderStyle.SINGLE,size:6,color:TEAL},bottom:thin,left:thin,right:thin},
      margins:{top:60,bottom:100,left:120,right:120},
      children:[
        ...[1,2,3,4,5].map(()=>new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text:" ",size:19,font:"Arial"})]})),
        ...(hint?[new Paragraph({spacing:{before:40,after:0},children:[new TextRun({text:hint,size:16,color:MGRAY,font:"Arial",italics:true})]})]:[]),
      ]
    })]}),
  ]
});
const exBox=(label,text,fill,accent)=>new Table({
  width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
  rows:[new TableRow({children:[new TableCell({
    borders:{top:{style:BorderStyle.SINGLE,size:4,color:accent},bottom:{style:BorderStyle.SINGLE,size:4,color:accent},left:{style:BorderStyle.SINGLE,size:16,color:accent},right:{style:BorderStyle.SINGLE,size:4,color:accent}},
    shading:{fill,type:ShadingType.CLEAR},
    margins:{top:100,bottom:100,left:160,right:120},
    children:[
      new Paragraph({spacing:{before:0,after:40},children:[new TextRun({text:label,bold:true,size:17,color:accent,font:"Arial"})]}),
      new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text,size:18,color:DGRAY,font:"Arial",italics:true})]}),
    ]
  })]})],
});
const rubricTable=rows=>new Table({
  width:{size:9360,type:WidthType.DXA},columnWidths:[7560,1800],
  rows:[
    new TableRow({children:[hdr("Criterion",7560),hdr("Points",1800)]}),
    ...rows.map(([c,p],i)=>new TableRow({children:[
      cell([new Paragraph({children:[new TextRun({text:c,size:17,color:DGRAY,font:"Arial"})]})],7560,i%2===0?WHITE:LTGRAY),
      cell([new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:p,bold:true,size:17,color:TEAL,font:"Arial"})]})],1800,i%2===0?WHITE:LTGRAY),
    ]}))
  ]
});
const inputField=lbl=>new TableCell({
  borders:noBorders,margins:{top:0,bottom:60,left:0,right:80},width:{size:4680,type:WidthType.DXA},
  children:[
    new Paragraph({spacing:{before:0,after:40},children:[new TextRun({text:lbl,bold:true,size:18,color:NAVY,font:"Arial"})]}),
    new Table({width:{size:4500,type:WidthType.DXA},columnWidths:[4500],rows:[new TableRow({children:[
      new TableCell({borders:thinBorders,margins:{top:60,bottom:60,left:80,right:80},children:[new Paragraph({children:[new TextRun({text:" ",size:19,font:"Arial"})]})]}),
    ]})]}),
  ]
});

// TITLE
const titleBlock=()=>[
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
    rows:[new TableRow({children:[new TableCell({
      borders:noBorders,shading:{fill:NAVY,type:ShadingType.CLEAR},
      margins:{top:220,bottom:180,left:320,right:320},
      children:[
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:50},children:[new TextRun({text:"EMA 6938 \u2014 Data Science for Materials",size:19,color:"BDD7EE",font:"Arial"})]}),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60},children:[new TextRun({text:"Final Project \u2014 Peer Review Form",bold:true,size:38,color:WHITE,font:"Arial"})]}),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new TextRun({text:"Week 12  \u2022  One form per presenter  \u2022  Due within 48 hours",size:18,color:"BDD7EE",font:"Arial"})]}),
      ]
    })]})],
  }),
  sp(4),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[2340,2340,2340,2340],
    rows:[new TableRow({children:[
      ...[["Ungraded","Completion credit"],["Submission","Canvas text entry"],["Length","150\u2013300 words total"],["Reviews","One form per presenter"]]
        .map(([l,v])=>new TableCell({
          borders:noBorders,shading:{fill:LTBLUE,type:ShadingType.CLEAR},
          margins:{top:90,bottom:90,left:140,right:140},width:{size:2340,type:WidthType.DXA},
          children:[
            new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:l,bold:true,size:17,color:NAVY,font:"Arial"})]}),
            new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:v,size:16,color:MGRAY,font:"Arial"})]}),
          ]
        }))
    ]})]
  }),
];

// REVIEWER INFO
const reviewerInfo=()=>[
  secHead("Reviewer Information"),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[4680,4680],
    rows:[
      new TableRow({children:["Your name","Presenter\u2019s name"].map(inputField)}),
      new TableRow({children:[
        inputField("Project title"),
        new TableCell({
          borders:noBorders,margins:{top:60,bottom:0,left:80,right:0},width:{size:4680,type:WidthType.DXA},
          children:[
            new Paragraph({spacing:{before:0,after:40},children:[new TextRun({text:"Presentation format",bold:true,size:18,color:NAVY,font:"Arial"})]}),
            new Table({width:{size:4500,type:WidthType.DXA},columnWidths:[2250,2250],rows:[new TableRow({children:[
              new TableCell({borders:thinBorders,margins:{top:60,bottom:60,left:80,right:80},width:{size:2250,type:WidthType.DXA},children:[new Paragraph({children:[new TextRun({text:"\u2610  Live Zoom",size:18,font:"Arial",color:DGRAY})]})]},),
              new TableCell({borders:thinBorders,margins:{top:60,bottom:60,left:80,right:80},width:{size:2250,type:WidthType.DXA},children:[new Paragraph({children:[new TextRun({text:"\u2610  Pre-recorded",size:18,font:"Arial",color:DGRAY})]})]}),
            ]})]}),
          ]
        }),
      ]}),
    ]
  }),
];

// Q1
const q1=()=>[
  secHead("Question 1 \u2014 One Specific Strength"),
  new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[7760,1600],rows:[
    new TableRow({children:[cell([body("Identify one thing the presenter did particularly well. Be specific \u2014 cite a slide, a result, a methodological choice, or a moment in the Q&A. Generic praise earns zero credit.")],7760,LTGRAY),ptsTag("3 pts")]})
  ]}),
  sp(4),
  exBox("\u274c  Not acceptable \u2014 generic praise",'"Great presentation, very clear and well organized."',LTRED,RED),
  sp(3),
  exBox("\u2714  Acceptable \u2014 specific with evidence",'"The prototype-aware train/test split in slide 7 was methodologically rigorous \u2014 most published ML-for-materials papers use random splits and this directly addresses that known weakness. The MAE comparison between the two splits was the most informative result in the presentation."',LTGREEN,GREEN),
  sp(6),
  writeBox("Write your response here:","Cite a specific slide, result, or methodological choice \u2014 not a general impression"),
  sp(4),
  rubricTable([["Specific, cites evidence from the presentation","3 pts"],["Positive but vague \u2014 no specific evidence","1 pt"],['"Great job" or equivalent with no substantive content',"0 pts"]]),
];

// Q2
const q2=()=>[
  secHead("Question 2 \u2014 One Methodological Weakness or Limitation"),
  new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[7760,1600],rows:[
    new TableRow({children:[cell([body("Identify one methodological weakness, gap, or limitation the presenter did not fully address. Be constructive \u2014 the goal is to improve the work, not criticize the person.")],7760,LTGRAY),ptsTag("3 pts")]})
  ]}),
  sp(4),
  exBox("\u274c  Not acceptable \u2014 too vague",'"They could have used more data and tried more models."',LTRED,RED),
  sp(3),
  exBox("\u2714  Acceptable \u2014 specific and scientifically grounded",'"The model was trained on Materials Project data (GGA-PBE computed) and evaluated against experimental Tg values. This domain shift is a potential source of the high test MAE that was not discussed. It would strengthen the paper to quantify this gap or restrict to one data source."',LTGREEN,GREEN),
  sp(6),
  writeBox("Write your response here:","Explain why the weakness matters scientifically \u2014 not just what it is"),
  sp(4),
  rubricTable([["Specific weakness identified, explains why it matters scientifically","3 pts"],["Identifies a real issue but without explanation of its impact","1.5 pts"],['Vague ("could be improved") or only cosmetic issues',"0 pts"]]),
];

// Q3
const q3=()=>[
  secHead("Question 3 \u2014 One Substantive Scientific Question"),
  new Table({width:{size:9360,type:WidthType.DXA},columnWidths:[7760,1600],rows:[
    new TableRow({children:[cell([body("Write one question that advances the science \u2014 something the presenter could investigate as a next step. Not a clarification question. A good question opens a direction the presenter may not have considered.")],7760,LTGRAY),ptsTag("1.5 pts")]})
  ]}),
  sp(4),
  exBox("\u274c  Not acceptable \u2014 clarification question",'"How many data points did you use?"',LTRED,RED),
  sp(3),
  exBox("\u2714  Acceptable \u2014 opens a scientific direction",'"Your feature importance shows electronegativity difference as the top predictor \u2014 but for transition metal oxides, d-electron count and crystal field splitting are often more physically meaningful. Have you tried oxidation-state-aware features and does it change which descriptor dominates?"',LTGREEN,GREEN),
  sp(6),
  writeBox("Write your question here:","Must open a direction the presenter could investigate \u2014 not a clarification"),
  sp(4),
  rubricTable([["Opens a scientific direction the presenter could pursue","1.5 pts"],["A real question but primarily a clarification","0.5 pts"],["Rhetorical, too vague, or already answered in the talk","0 pts"]]),
];

// Q4 OVERALL RATING
const q4=()=>[
  secHead("Question 4 \u2014 Overall Rating (Ungraded)"),
  body("Circle your rating for each dimension. This does not affect your grade \u2014 it is feedback for the presenter only."),
  sp(6),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[3000,1590,1590,1590,1590],
    rows:[
      new TableRow({children:[hdr("Dimension",3000),hdr("1 \u2014 Needs work",1590),hdr("2 \u2014 Adequate",1590),hdr("3 \u2014 Good",1590),hdr("4 \u2014 Excellent",1590)]}),
      ...[
        ["Scientific rigor","Significant errors","Acceptable","Sound","Rigorous"],
        ["Clarity of presentation","Hard to follow","Understandable","Clear","Very clear"],
        ["Materials science connection","Only computational","Some connection","Good connection","Deep integration"],
      ].map(([dim,...lvls],i)=>new TableRow({children:[
        cell([new Paragraph({children:[new TextRun({text:dim,bold:true,size:17,color:DGRAY,font:"Arial"})]})],3000,i%2===0?WHITE:LTGRAY),
        ...lvls.map(l=>cell([
          new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"\u2610",size:18,font:"Arial",color:DGRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:l,size:14,color:MGRAY,font:"Arial"})]}),
        ],1590,i%2===0?WHITE:LTGRAY))
      ]}))
    ]
  }),
  sp(6),
  new Paragraph({spacing:{before:0,after:50},children:[new TextRun({text:"Additional comments for the presenter (optional):",bold:true,size:19,color:NAVY,font:"Arial"})]}),
  writeBox("","Anything else you found interesting or worth exploring"),
];

// SCORE SUMMARY
const scoreSummary=()=>[
  secHead("Score Summary"),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[7560,1800],
    rows:[
      new TableRow({children:[hdr("Component",7560),hdr("Points",1800)]}),
      ...[
        ["Q1 \u2014 One specific strength","   / 3 pts"],
        ["Q2 \u2014 One methodological weakness","   / 3 pts"],
        ["Q3 \u2014 One substantive question","   / 1.5 pts"],
        ["This review total","   / 7.5 pts"],
      ].map(([l,p],i)=>new TableRow({children:[
        cell([new Paragraph({children:[new TextRun({text:l,bold:i===3,size:18,color:DGRAY,font:"Arial"})]})],7560,i===3?LTBLUE:(i%2===0?WHITE:LTGRAY)),
        cell([new Paragraph({children:[new TextRun({text:p,bold:i===3,size:18,color:i===3?NAVY:MGRAY,font:"Arial"})]})],1800,i===3?LTBLUE:(i%2===0?WHITE:LTGRAY)),
      ]}))
    ]
  }),
  sp(4),
  body("Complete two reviews total: 7.5 pts \u00d7 2 = 15 pts (15% of final grade).",{color:MGRAY,italics:true}),
  sp(6),
  new Table({
    width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
    rows:[new TableRow({children:[new TableCell({
      borders:{top:{style:BorderStyle.SINGLE,size:4,color:PURPLE},bottom:{style:BorderStyle.SINGLE,size:4,color:PURPLE},left:{style:BorderStyle.SINGLE,size:16,color:PURPLE},right:{style:BorderStyle.SINGLE,size:4,color:PURPLE}},
      shading:{fill:LTPURPLE,type:ShadingType.CLEAR},
      margins:{top:110,bottom:110,left:160,right:130},
      children:[
        new Paragraph({spacing:{before:0,after:50},children:[new TextRun({text:"\uD83D\uDD12  Instructor grading note \u2014 not shared with students",bold:true,size:17,color:PURPLE,font:"Arial"})]}),
        new Paragraph({spacing:{before:0,after:0},children:[new TextRun({text:"Grade Q1+Q2+Q3 after reading all reviews for a presenter. Substance of the scientific insight matters more than writing quality. Calibrate by reading the strongest review first. A review that only says positive things about a project with obvious methodological flaws earns 0/7.5 regardless of length.",size:17,color:DGRAY,font:"Arial"})]}),
      ]
    })]})],
  }),
];

const doc=new Document({
  numbering:{config:[{reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:480,hanging:280}}}}]}]},
  styles:{default:{document:{run:{font:"Arial",size:19,color:DGRAY}}}},
  sections:[{
    properties:{page:{size:{width:12240,height:15840},margin:{top:1008,right:1008,bottom:1008,left:1008}}},
    footers:{default:new Footer({children:[new Paragraph({
      tabStops:[{type:TabStopType.RIGHT,position:9360}],
      spacing:{before:0,after:0},
      border:{top:{style:BorderStyle.SINGLE,size:4,color:TEAL,space:6}},
      children:[
        new TextRun({text:"EMA 6938 \u2014 Final Project Peer Review Form",size:15,color:MGRAY,font:"Arial"}),
        new TextRun({text:"\t",size:15,font:"Arial"}),
        new TextRun({text:"Page ",size:15,color:MGRAY,font:"Arial"}),
        new SimpleField({instruction:"PAGE",cachedValue:"1",dirty:false}),
      ]
    })]})},
    children:[
      ...titleBlock(),sp(8),
      ...reviewerInfo(),sp(8),
      ...q1(),sp(8),
      ...q2(),sp(8),
      ...q3(),sp(8),
      ...q4(),sp(8),
      ...scoreSummary(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync("peer_review_form.docx",buf);
  console.log("Done. File saved as peer_review_form.docx");
});
