import React, { useCallback } from 'react';
import { Button, Grid, Header, Segment } from 'semantic-ui-react';
import { PerfTypeScoreProps } from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { renderNumber } from '../../../lib/util/renderNumber';
import renderHyphen from '../../../lib/util/renderHyphen';
import { find, replace, reverse, sortBy, toString } from 'lodash';

interface PerfFormTypeTotalScoreMidProps {
  data: PerfTypeScoreProps;
  level?: any;
  endYear?: boolean;
  grades: any;
}

const PerfFormTypeTotalScoreMid = ({
  data,
  level,
  endYear,
  grades,
}: PerfFormTypeTotalScoreMidProps) => {
  const gradeLabeling = (score: number) => {
    const sortedGrade = reverse(sortBy(grades, 'maximum'));
    const maxGrade = sortedGrade?.[0]?.maximum;
    let scoreToString = replace(toString(score), ',', '.');
    if (scoreToString > maxGrade) scoreToString = maxGrade;
    const findGrade = find(grades, (grade) => {
      return grade?.maximum >= scoreToString && grade?.minimum <= scoreToString;
    });
    return `${renderHyphen(findGrade?.codeGrade)} - ${renderHyphen(
      findGrade?.codeName,
    )}`;
  };

  const renderScore = useCallback(
    (score) => {
      const sortedGrade = reverse(sortBy(grades, 'maximum'));
      const maxGrade = sortedGrade?.[0]?.maximum;
      const scoreToString = replace(toString(score), ',', '.');
      if (scoreToString > maxGrade) return renderNumber(maxGrade);
      return renderNumber(score, false, true);
    },
    [grades],
  );

  return (
    <Grid columns="equal" textAlign="center" className="border-top-teal">
      <Grid.Row>
        <Grid.Column textAlign={'center'}>
          <Segment
            className={'notes-soft-purple-bg'}
            style={{
              padding: '0px 0px 15px 0px',
            }}
          >
            <div className="segment-performance-score">
              <Header
                as={'h4'}
                style={{
                  color: 'white',
                }}
              >
                Total Score by Appraise
              </Header>
            </div>
            <Grid columns={'equal'} container style={{ pointerEvents: 'none' }}>
              <Grid.Row textAlign={'center'}>
                {endYear && (
                  <Grid.Column textAlign={'center'}>
                    <Header
                      as="h4"
                      style={{
                        color: '#6A53EF',
                        marginBottom: 5,
                      }}
                    >
                      Mid Year
                    </Header>
                    <Button
                      labelPosition="right"
                      className="content-performance-score"
                      content={renderScore(data?.midScoreBySelf)}
                      label={{
                        className: 'content-label-performance-score',
                        pointing: false,
                        content: `${gradeLabeling(
                          renderNumber(data?.midScoreBySelf, false, true),
                        )}`,
                      }}
                    />
                  </Grid.Column>
                )}

                <Grid.Column textAlign={'center'}>
                  {endYear && (
                    <Header
                      as="h4"
                      style={{
                        color: '#6A53EF',
                        marginBottom: 5,
                      }}
                      textAlign="center"
                    >
                      End Year
                    </Header>
                  )}
                  <Button
                    labelPosition="right"
                    className="content-performance-score"
                    content={
                      endYear
                        ? renderScore(data?.endScoreBySelf)
                        : renderScore(data?.midScoreBySelf)
                    }
                    label={{
                      className: 'content-label-performance-score',
                      pointing: false,
                      content: `${gradeLabeling(
                        endYear
                          ? renderNumber(data?.endScoreBySelf, false, true)
                          : renderNumber(data?.midScoreBySelf, false, true),
                      )}`,
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Grid.Column>

        {level?.includes('MANAGER') && (
          <Grid.Column>
            <Segment
              className={'notes-soft-purple-bg'}
              style={{
                padding: '0px 0px 15px 0px',
              }}
            >
              <div className="segment-performance-score">
                <Header
                  as={'h4'}
                  style={{
                    color: 'white',
                  }}
                >
                  Total Score by Direct Manager
                </Header>
              </div>
              <Grid
                columns={'equal'}
                container
                style={{ pointerEvents: 'none' }}
              >
                <Grid.Row>
                  {endYear && (
                    <Grid.Column textAlign={'center'}>
                      <Header
                        as="h4"
                        style={{
                          color: '#6A53EF',
                          marginBottom: 5,
                        }}
                        textAlign="center"
                      >
                        Mid Year
                      </Header>
                      <Button
                        labelPosition="right"
                        className="content-performance-score"
                        content={renderNumber(data?.midScoreByDM, false, true)}
                        label={{
                          className: 'content-label-performance-score',
                          pointing: false,
                          content: `${gradeLabeling(
                            renderNumber(data?.midScoreByDM, false, true),
                          )}`,
                        }}
                      />
                    </Grid.Column>
                  )}

                  <Grid.Column textAlign={'center'}>
                    {endYear && (
                      <Header
                        as="h4"
                        style={{
                          color: '#6A53EF',
                          marginBottom: 5,
                        }}
                        textAlign="center"
                      >
                        End Year
                      </Header>
                    )}
                    <Button
                      labelPosition="right"
                      className="content-performance-score"
                      content={
                        endYear
                          ? renderNumber(data?.endScoreByDM, false, true)
                          : renderNumber(data?.midScoreByDM, false, true)
                      }
                      label={{
                        className: 'content-label-performance-score',
                        pointing: false,
                        content: `${gradeLabeling(
                          endYear
                            ? renderNumber(data?.endScoreByDM, false, true)
                            : renderNumber(data?.midScoreByDM, false, true),
                        )}`,
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        )}
        {level?.includes('MANAGER') && (
          <Grid.Column>
            <Segment
              className={'notes-soft-purple-bg'}
              style={{
                padding: '0px 0px 15px 0px',
              }}
            >
              <div className="segment-performance-score">
                <Header
                  as={'h4'}
                  style={{
                    color: 'white',
                  }}
                >
                  Total Score by Above Direct Manager
                </Header>
              </div>
              <Grid
                columns={'equal'}
                container
                style={{ pointerEvents: 'none' }}
              >
                <Grid.Row>
                  {endYear && (
                    <Grid.Column textAlign={'center'}>
                      <Header
                        as="h4"
                        style={{
                          color: '#6A53EF',
                          marginBottom: 5,
                        }}
                        textAlign="center"
                      >
                        Mid Year
                      </Header>
                      <Button
                        labelPosition="right"
                        className="content-performance-score"
                        content={renderNumber(
                          data?.midScoreByAboveDM,
                          false,
                          true,
                        )}
                        label={{
                          className: 'content-label-performance-score',
                          pointing: false,
                          content: `${gradeLabeling(
                            renderNumber(data?.midScoreByAboveDM, false, true),
                          )}`,
                        }}
                      />
                    </Grid.Column>
                  )}
                  <Grid.Column textAlign={'center'}>
                    {endYear && (
                      <Header
                        as="h4"
                        style={{
                          color: '#6A53EF',
                          marginBottom: 5,
                        }}
                        textAlign="center"
                      >
                        End Year
                      </Header>
                    )}
                    <Button
                      labelPosition="right"
                      className="content-performance-score"
                      content={
                        endYear
                          ? renderNumber(data?.endScoreByAboveDM, true, true)
                          : renderNumber(data?.midScoreByAboveDM, true, true)
                      }
                      label={{
                        className: 'content-label-performance-score',
                        pointing: false,
                        content: `${gradeLabeling(
                          endYear
                            ? renderNumber(data?.endScoreByAboveDM, false, true)
                            : renderNumber(
                                data?.midScoreByAboveDM,
                                false,
                                true,
                              ),
                        )}`,
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default PerfFormTypeTotalScoreMid;
