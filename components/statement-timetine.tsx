// 'use client'

// import { useState } from 'react'
// import Timeline from '@mui/lab/Timeline'
// import TimelineItem from '@mui/lab/TimelineItem'
// import TimelineSeparator from '@mui/lab/TimelineSeparator'
// import TimelineConnector from '@mui/lab/TimelineConnector'
// import TimelineContent from '@mui/lab/TimelineContent'
// import TimelineDot, {
//   TimelineDotProps
// } from '@mui/lab/TimelineDot'
// import TimelineOppositeContent, {
//   timelineOppositeContentClasses,
// } from '@mui/lab/TimelineOppositeContent'

// import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

// import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
// import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'

// import MyLatex from '@components/my-latex'

// export default function StatementTimeline({ chapter }: { chapter: Chapter }) {

//   const [statementStates, setStatementStates] = useState(
//     chapter.statements.map(() => ({
//       visible: false,
//       implicationsVisible: false,
//     }))
//   );

//   function toggleStatement(index: number) {
//     const newStatementStates = [...statementStates]
//     newStatementStates[index].visible = !newStatementStates[index].visible
//     setStatementStates(newStatementStates)
//   };

//   function toggleImplication(statementIndex: number) {
//     const newStatementStates = [...statementStates]
//     newStatementStates[statementIndex].implicationsVisible = !newStatementStates[statementIndex].implicationsVisible
//     setStatementStates(newStatementStates)
//   }

//   const statementProps: { [key in StatementType]: {
//     color: TimelineDotProps["color"],
//     image: (chapterIndex: number, statementIndex: number) => JSX.Element,
//     contentBackground: string
//   } } = {
//     axiom: {
//       color: 'secondary',
//       image: (statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-[#0288d1]' : 'text-gray-700'} />
//       ),
//       contentBackground: 'bg-[#a0d7f5]'

//     },
//     definition: {
//       color: 'info',
//       image: (statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-white' : 'text-[#0288d1]'} />
//       ),
//       contentBackground: 'bg-[#aad7ef]'
//     },
//     lemma: {
//       color: 'primary',
//       image: (statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-[#0288d1]' : 'text-gray-700'} />
//       ),
//       contentBackground: 'bg-[#77c7f2]'
//     },
//     theorem: {
//       color: 'success',
//       image: (statementIndex) => (
//         <NotificationsActiveRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-white' : 'text-[#2e7d32]'} />
//       ),
//       contentBackground: 'bg-[#a3cca5]'

//     },
//     corollary: {
//       color: 'grey',
//       image: (statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-[#0288d1]' : 'text-gray-700'} />
//       ),
//       contentBackground: 'bg-[#77c7f2]'

//     },
//     example: {
//       color: 'warning',
//       image: (chapterIndex, statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-[#0288d1]' : 'text-gray-700'} />
//       ),
//       contentBackground: 'bg-[#77c7f2]'
//     },
//     note: {
//       color: 'primary',
//       image: (chapterIndex, statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-[#0288d1]' : 'text-gray-700'} />
//       ),
//       contentBackground: 'bg-[#77c7f2]'
//     },
//     thoughtBubble: {
//       color: 'primary',
//       image: (chapterIndex, statementIndex) => (
//         <TipsAndUpdatesRoundedIcon
//           className={statementStates[statementIndex].visible
//             ? 'text-[#0288d1]' : 'text-gray-700'} />
//       ),
//       contentBackground: 'bg-[#77c7f2]'
//     },
//   }

//   return (
//     <div className='m-5'>
//       <Timeline
//         sx={{
//           [`& .${timelineOppositeContentClasses.root}`]: {
//             flex: 0.2,
//           },
//         }}>

//         {chapter.statements.map((statement, statementIndex) => (
//           statement.type !== 'thoughtBubble' ?
//             <TimelineItem
//               key={`${statementIndex}`}>

//               <TimelineOppositeContent>
//                 <div
//                   itemID='timeline-opposite-content-container'
//                   className='text-lg'>
//                   {statement.type.charAt(0).toUpperCase() + statement.type.slice(1)} {chapterIndex + 1}.{statementIndex + 1}
//                 </div>
//               </TimelineOppositeContent>

//               <TimelineSeparator

//               >
//                 <TimelineDot
//                   sx={{
//                     width: 40,
//                     height: 40,
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     cursor: 'pointer'
//                   }}
//                   color={statementProps[statement.type].color}
//                   variant={showedItems[chapterIndex].showedStatements[statementIndex] ? 'filled' : 'outlined'}
//                   onClick={() => toggleStatement(chapterIndex, statementIndex)}>
//                   {statementProps[statement.type].image(chapterIndex, statementIndex)}
//                 </TimelineDot>

//                 {statementIndex !== chapter.statements.length - 1 && chapter.statements[statementIndex + 1].type !== 'thoughtBubble' &&
//                   <TimelineConnector sx={showedItems[chapterIndex].showedStatements[statementIndex] && statement.content !== "" ? { height: 80 } : { height: 20 }} />}
//               </TimelineSeparator>

//               <TimelineContent>
//                 <div className='text-lg'>
//                   <MyLatex>
//                     {statement.statementName ? statement.statementName.charAt(0).toUpperCase() + statement.statementName.slice(1) : ""}
//                   </MyLatex>
//                 </div>
//                 <div className={`mt-2 transition-all duration-500 ${showedItems[chapterIndex].showedStatements[statementIndex] ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
//                   {showedItems[chapterIndex].showedStatements[statementIndex]
//                     && statement.content !== ""
//                     && <div className={`relative text-black ${statementProps[statement.type].contentBackground} p-3 rounded-xl`}>
//                       <MyLatex>
//                         {statement.content}
//                       </MyLatex>
//                       {statement.implications
//                         && statement.implications.length !== 0
//                         &&
//                         <ExpandMoreOutlinedIcon
//                           onClick={() => toggleImplication(chapterIndex, statementIndex)}
//                           className={`absolute bottom-3 right-3 w-6 h-6 cursor-pointer
//                                           text-${statementProps[statement.type].color}`} />
//                       }
//                     </div>
//                   }

//                   {showedItems[chapterIndex].showedStatements[statementIndex]
//                     && showedItems[chapterIndex].showedImplications[statementIndex]
//                     && statement.implications
//                     && statement.implications.length !== 0
//                     && statement.implications.map((implication, implicationIndex) => (
//                       <Timeline
//                         key={`implications-${implicationIndex}`}
//                         sx={{
//                           [`& .${timelineOppositeContentClasses.root}`]: {
//                             flex: 0,
//                           },
//                         }}
//                       >
//                         <TimelineItem key={`${statementIndex}-${implicationIndex}`}>
//                           <TimelineOppositeContent />
//                           <TimelineDot color={statementProps[implication.type].color} />
//                           <TimelineContent>
//                             <b>
//                               {implication.type.charAt(0).toUpperCase() + implication.type.slice(1)} {implicationIndex + 1}. {implication.statementName !== '' && `(${implication.statementName})`}
//                             </b>
//                             <MyLatex>
//                               {implication.content}
//                             </MyLatex>
//                           </TimelineContent>
//                         </TimelineItem>
//                       </Timeline>
//                     ))}
//                 </div>
//               </TimelineContent>
//             </TimelineItem>
//             :
//             <div key={statementIndex}
//               className={`p-5 rounded-md
//                           h-auto
//                          bg-blue-300`}>
//               <MyLatex>
//                 {`<b>
//                     ${statement.statementName ?
//                     statement.statementName.charAt(0).toUpperCase() + statement.statementName.slice(1) :
//                     ''}.
//                   </b>
//               ${statement.content}`}
//               </MyLatex>
//             </div>
//         ))}
//       </Timeline>
//       ))}
//     </div>
//   )
// }