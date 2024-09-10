// import React, { useRef } from 'react';

// import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea/TextArea';
// import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
// import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
// import Table from 'semantic-ui-react/dist/commonjs/collections/Table/Table';
// import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
// import Input from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
// import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';

// import { PerfEmpItem } from '../../performanceGoalSetting/types/goalSettingTypes';

// import crypto from 'crypto';

// interface FinalHistoryCategoryItemSectionProps {
//   leftPerfHistoryDetail: GoalSettingHistoryDetail;
//   rightPerfHistoryDetail: GoalSettingHistoryDetail;
//   finalPerfHistoryDetail: GoalSettingHistoryReference;
//   perfEmpItemObj: PerfEmpItem;
//   isKRA: boolean;
//   isTarget: boolean;
// }

// function FinalHistoryPerformanceCategoryItemSection({
//   leftPerfHistoryDetail,
//   rightPerfHistoryDetail,
//   finalPerfHistoryDetail,
//   perfEmpItemObj,
//   isKRA,
//   isTarget,
// }: FinalHistoryCategoryItemSectionProps) {
//   const { current: perfEmpItemId } = useRef(perfEmpItemObj.id);

//   return (
//     <Grid.Row>
//       <Grid.Column>
//         <div>
//           <Segment>
//             {perfEmpItemObj.perfFormTypeItem.type === 'CATEGORY' && (
//               <Header as={'p'} color={'purple'} floated={'left'} size="tiny">
//                 {perfEmpItemObj.perfFormTypeItem.perfCategory.name}
//               </Header>
//             )}

//             <div>
//               <Table color={'teal'} singleLine compact>
//                 {/* The header of perf employee goal setting table */}
//                 <Table.Header>
//                   <Table.Row>
//                     {/* KRA header column */}
//                     {isKRA && (
//                       <Table.HeaderCell
//                         singleLine
//                         textAlign={'center'}
//                         width={4}
//                         attribute={'kpi'}
//                         name={'KPI'}
//                       >
//                         Key Responsibility Area (KRA)
//                       </Table.HeaderCell>
//                     )}

//                     {/* KPI header column */}
//                     <Table.HeaderCell
//                       singleLine
//                       textAlign={'center'}
//                       width={isKRA || isTarget ? 4 : 6}
//                       attribute={'kpi'}
//                       name={'KPI'}
//                     >
//                       Key Performance Indicator (KPI)
//                     </Table.HeaderCell>

//                     {/* Target header column */}
//                     {isTarget && (
//                       <Table.HeaderCell
//                         singleLine
//                         textAlign={'center'}
//                         width={4}
//                         attribute={'kpi'}
//                         name={'KPI'}
//                       >
//                         Target
//                       </Table.HeaderCell>
//                     )}

//                     {/* Achievement header column */}
//                     <Table.HeaderCell
//                       singleLine
//                       textAlign={'center'}
//                       width={isKRA || isTarget ? 4 : 6}
//                       attribute={'achievement'}
//                       name={'Achievement'}
//                     >
//                       Result & Achievement
//                     </Table.HeaderCell>

//                     {/* Weight header column */}
//                     <Table.HeaderCell
//                       singleLine
//                       textAlign={'center'}
//                       width={isKRA || isTarget ? 2 : 1}
//                       attribute={'weight'}
//                       name={'Weight'}
//                     >
//                       Weight(%)
//                     </Table.HeaderCell>

//                     {/* History Version header column */}
//                     <Table.HeaderCell
//                       singleLine
//                       textAlign={'center'}
//                       width={1}
//                       attribute={''}
//                       name={''}
//                     ></Table.HeaderCell>
//                   </Table.Row>
//                 </Table.Header>
//                 {/* The body/content of perf employee goal setting table */}
//                 <Table.Body>
//                   {Object.keys(finalPerfHistoryDetail[perfEmpItemId]).map(
//                     (histItemPerKPIId) => {
//                       const goalSettingHistory =
//                         finalPerfHistoryDetail[perfEmpItemId][histItemPerKPIId];

//                       const renderHistoryStatus = historyStatus(
//                         goalSettingHistory.historyStatus,
//                       );

//                       const renderHistoryRowColor =
//                         historyRowColor(renderHistoryStatus);
//                       return (
//                         <React.Fragment
//                           key={crypto.randomBytes(64).toString('hex')}
//                         >
//                           {/* Rules for Right History data */}
//                           {(renderHistoryStatus.ADD ||
//                             renderHistoryStatus.CHANGE) && (
//                             <Table.Row
//                               key={`history-${perfEmpItemId}__${histItemPerKPIId}__${goalSettingHistory.rightHistoryId}`}
//                               className={renderHistoryRowColor}
//                             >
//                               {/* Value of KRA */}
//                               {isKRA && (
//                                 <Table.Cell>
//                                   <Form>
//                                     <TextArea
//                                       value={
//                                         rightPerfHistoryDetail[perfEmpItemId][
//                                           histItemPerKPIId
//                                         ].kra
//                                       }
//                                       rows={1}
//                                       disabled
//                                     />
//                                   </Form>
//                                 </Table.Cell>
//                               )}

//                               {/* Value of KPI */}
//                               <Table.Cell>
//                                 <Form>
//                                   <TextArea
//                                     value={
//                                       rightPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].kpi
//                                     }
//                                     rows={1}
//                                     disabled
//                                   />
//                                 </Form>
//                               </Table.Cell>

//                               {/* Value of Target */}
//                               {isTarget && (
//                                 <Table.Cell>
//                                   <Form>
//                                     <TextArea
//                                       value={
//                                         rightPerfHistoryDetail[perfEmpItemId][
//                                           histItemPerKPIId
//                                         ].target
//                                       }
//                                       rows={1}
//                                       disabled
//                                     />
//                                   </Form>
//                                 </Table.Cell>
//                               )}

//                               {/* Value of Achievement */}
//                               <Table.Cell>
//                                 <Form>
//                                   <TextArea
//                                     value={
//                                       rightPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].achievement
//                                     }
//                                     rows={1}
//                                     disabled
//                                   />
//                                 </Form>
//                               </Table.Cell>

//                               {/* Value of Weight */}
//                               <Table.Cell>
//                                 <Form>
//                                   <Input
//                                     value={
//                                       rightPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].weight
//                                     }
//                                     rows={1}
//                                     disabled
//                                   />
//                                 </Form>
//                               </Table.Cell>

//                               {/* Value of History Version */}
//                               <Table.Cell>
//                                 <p>
//                                   V
//                                   {
//                                     rightPerfHistoryDetail[perfEmpItemId][
//                                       histItemPerKPIId
//                                     ].version
//                                   }
//                                 </p>
//                               </Table.Cell>
//                             </Table.Row>
//                           )}
//                           {/* Rules for Left History data */}
//                           {(renderHistoryStatus.CHANGE ||
//                             renderHistoryStatus.NO_CHANGE ||
//                             renderHistoryStatus.REMOVE) && (
//                             <Table.Row
//                               key={`history-${perfEmpItemId}__${histItemPerKPIId}__${goalSettingHistory.leftHistoryId}`}
//                               className={renderHistoryRowColor}
//                             >
//                               {/* Value of KRA */}
//                               {isKRA && (
//                                 <Table.Cell
//                                   className={
//                                     renderHistoryStatus.CHANGE
//                                       ? 'no-border'
//                                       : ''
//                                   }
//                                 >
//                                   <Form>
//                                     <TextArea
//                                       value={
//                                         leftPerfHistoryDetail[perfEmpItemId][
//                                           histItemPerKPIId
//                                         ].kra
//                                       }
//                                       rows={1}
//                                       disabled
//                                     />
//                                   </Form>
//                                 </Table.Cell>
//                               )}

//                               {/* Value of KPI */}
//                               <Table.Cell
//                                 className={
//                                   renderHistoryStatus.CHANGE ? 'no-border' : ''
//                                 }
//                               >
//                                 <Form>
//                                   <TextArea
//                                     value={
//                                       leftPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].kpi
//                                     }
//                                     rows={1}
//                                     disabled
//                                   />
//                                 </Form>
//                               </Table.Cell>

//                               {/* Value of Target */}
//                               {isTarget && (
//                                 <Table.Cell
//                                   className={
//                                     renderHistoryStatus.CHANGE
//                                       ? 'no-border'
//                                       : ''
//                                   }
//                                 >
//                                   <Form>
//                                     <TextArea
//                                       value={
//                                         leftPerfHistoryDetail[perfEmpItemId][
//                                           histItemPerKPIId
//                                         ].target
//                                       }
//                                       rows={1}
//                                       disabled
//                                     />
//                                   </Form>
//                                 </Table.Cell>
//                               )}

//                               {/* Value of Achievement */}
//                               <Table.Cell>
//                                 <Form>
//                                   <TextArea
//                                     value={
//                                       leftPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].achievement
//                                     }
//                                     rows={1}
//                                     disabled
//                                   />
//                                 </Form>
//                               </Table.Cell>

//                               {/* Value of Weight */}
//                               <Table.Cell
//                                 className={
//                                   renderHistoryStatus.CHANGE ? 'no-border' : ''
//                                 }
//                               >
//                                 <Form>
//                                   <Input
//                                     value={
//                                       leftPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].weight
//                                     }
//                                     rows={1}
//                                     disabled
//                                   />
//                                 </Form>
//                               </Table.Cell>

//                               {/* Value of History Version */}
//                               <Table.Cell
//                                 className={
//                                   renderHistoryStatus.CHANGE ? 'no-border' : ''
//                                 }
//                               >
//                                 {renderHistoryStatus.NO_CHANGE ? (
//                                   <p>
//                                     V
//                                     {
//                                       leftPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].version
//                                     }
//                                     , V
//                                     {
//                                       rightPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].version
//                                     }
//                                   </p>
//                                 ) : (
//                                   <p>
//                                     V
//                                     {
//                                       leftPerfHistoryDetail[perfEmpItemId][
//                                         histItemPerKPIId
//                                       ].version
//                                     }
//                                   </p>
//                                 )}
//                               </Table.Cell>
//                             </Table.Row>
//                           )}
//                         </React.Fragment>
//                       );
//                     },
//                   )}
//                 </Table.Body>
//               </Table>
//             </div>
//           </Segment>
//         </div>
//       </Grid.Column>
//     </Grid.Row>
//   );
// }

// export default FinalHistoryPerformanceCategoryItemSection;
