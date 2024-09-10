// import React, { useRef } from 'react';
// import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea/TextArea';
// import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';

// import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
// import Table from 'semantic-ui-react/dist/commonjs/collections/Table/Table';
// import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
// import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';

// import { PerfEmpItem } from '../../performanceGoalSetting/types/goalSettingTypes';

// interface LeftHistoryCategoryItemTableProps {
//   // leftPerfHistoryDetail: GoalSettingHistoryDetail;
//   perfEmpItemObj: PerfEmpItem;
//   isKRA: boolean;
//   isTarget: boolean;
// }

// function LeftHistoryPerformanceCategoryItemTable({
//   // leftPerfHistoryDetail,
//   perfEmpItemObj,
//   isKRA,
//   isTarget,
// }: LeftHistoryCategoryItemTableProps) {
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
//             {/* <br /> */}
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
//                       textAlign={'right'}
//                       width={1}
//                       attribute={''}
//                       name={''}
//                     ></Table.HeaderCell>
//                   </Table.Row>
//                 </Table.Header>
//                 {/* The body/content of perf employee goal setting table */}
//                 <Table.Body>
//                   {Object.keys(leftPerfHistoryDetail[perfEmpItemId]).map(
//                     (perfHistoryItemPerKPIId: any) => (
//                       <Table.Row
//                         key={`history-${perfEmpItemId}-${perfHistoryItemPerKPIId}`}
//                       >
//                         {/* Value of KRA */}
//                         {isKRA && (
//                           <Table.Cell>
//                             <Form>
//                               <TextArea
//                                 value={
//                                   leftPerfHistoryDetail[perfEmpItemId][
//                                     perfHistoryItemPerKPIId
//                                   ].kra
//                                 }
//                                 rows={1}
//                                 disabled
//                               />
//                             </Form>
//                           </Table.Cell>
//                         )}

//                         {/* Value of KPI */}
//                         <Table.Cell>
//                           <Form>
//                             <TextArea
//                               value={
//                                 leftPerfHistoryDetail[perfEmpItemId][
//                                   perfHistoryItemPerKPIId
//                                 ].kpi
//                               }
//                               rows={1}
//                               disabled
//                             />
//                           </Form>
//                         </Table.Cell>

//                         {/* Value of Target */}
//                         {isTarget && (
//                           <Table.Cell>
//                             <Form>
//                               <TextArea
//                                 value={
//                                   leftPerfHistoryDetail[perfEmpItemId][
//                                     perfHistoryItemPerKPIId
//                                   ].target
//                                 }
//                                 rows={1}
//                                 disabled
//                               />
//                             </Form>
//                           </Table.Cell>
//                         )}

//                         {/* Value of Achievement */}
//                         <Table.Cell>
//                           <Form>
//                             <TextArea
//                               value={
//                                 leftPerfHistoryDetail[perfEmpItemId][
//                                   perfHistoryItemPerKPIId
//                                 ].achievement
//                               }
//                               rows={1}
//                               disabled
//                             />
//                           </Form>
//                         </Table.Cell>

//                         {/* Value of Weight */}
//                         <Table.Cell>
//                           <Form>
//                             <TextArea
//                               value={
//                                 leftPerfHistoryDetail[perfEmpItemId][
//                                   perfHistoryItemPerKPIId
//                                 ].weight
//                               }
//                               rows={1}
//                               disabled
//                             />
//                           </Form>
//                         </Table.Cell>

//                         {/* Value of History Version */}
//                         <Table.Cell>
//                           <p>
//                             V
//                             {
//                               leftPerfHistoryDetail[perfEmpItemId][
//                                 perfHistoryItemPerKPIId
//                               ].version
//                             }
//                           </p>
//                         </Table.Cell>
//                       </Table.Row>
//                     ),
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

// export default LeftHistoryPerformanceCategoryItemTable;
