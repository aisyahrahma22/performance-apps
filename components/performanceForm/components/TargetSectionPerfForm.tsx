import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form, Grid, Icon, Table } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import InputDropdownRemote from '../../InputDropdownRemote';
import InputCheckbox from '../../InputCheckbox';
import { PerfFromRequestDataFormProps } from '../types/perfForm';
import TableHeaderCell from '../../TableHeaderCell';
import { getPerfKPINameList } from '../../../lib/data/performanceForm/usePerfKPINameList';
import { getPerfTargetNameList } from '../../../lib/data/performanceForm/usePerfTargetNameList';
import { usePerfFormContext } from '../contexts/PerfFormContext';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';

interface TargetDetailProps {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  isCategoryButtonActive: boolean;
  dataPerfTypeItemIdx: any;
  dataCategoryIdx: any;
}

const defaultDataTargetDetail = {
  performanceKPI: '',
  performanceTarget: '',
};

const TargetSectionPerfForm = ({
  isModalEdit,
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
}: TargetDetailProps) => {
  // this is selected data target from formik
  const selectedDataTarget =
    formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataTarget;
  const [targetDetailsItemLength, setTargetDetailsItemLength] =
    useState<number>(0);

  // sync targetDetailsItemLength with its formik length
  const [prevTargetDetailsItemLength, setPrevTargetDetailsItemLength] =
    useState<number>(0);
  if (
    isModalEdit &&
    selectedDataTarget?.dataTargetDetails &&
    !isEqual(
      selectedDataTarget.dataTargetDetails.length,
      prevTargetDetailsItemLength,
    )
  ) {
    setPrevTargetDetailsItemLength(selectedDataTarget.dataTargetDetails.length);
    setTargetDetailsItemLength(selectedDataTarget.dataTargetDetails.length);
  }

  // perf form API response
  const { performanceForm } = usePerfFormContext();
  const selectedPerfFormTargetResponse =
    performanceForm?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataTarget;

  // local state of isUserDefine
  const dataAllTargetIsUserDefine = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataTarget?.isUserDefine;
  }, [formik?.values, dataPerfTypeItemIdx, dataCategoryIdx]);

  // function to handle addition of new additional detail
  const addAdditionalDetailTarget = useCallback(() => {
    setTargetDetailsItemLength((prev) => prev + 1);
    const clonedDataTarget = cloneDeep(
      formik?.values?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
        dataCategoryIdx
      ]?.dataTarget,
    );

    if (!clonedDataTarget) return;
    clonedDataTarget.dataTargetDetails.push(defaultDataTargetDetail);
    formik?.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataTarget`,
      clonedDataTarget,
    );
  }, [dataCategoryIdx, dataPerfTypeItemIdx, formik]);

  // function to handle deletion of selected additional detail
  const deleteAdditionalDetailTarget = useCallback(
    (itemIdx) => {
      const clonedDataTarget = cloneDeep(
        formik?.values?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataTarget,
      );

      if (!clonedDataTarget) return;
      const clonedDataTargetDetails = clonedDataTarget.dataTargetDetails;
      clonedDataTargetDetails.splice(itemIdx, 1);
      formik.setFieldValue(
        `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataTarget.dataTargetDetails`,
        clonedDataTargetDetails,
      );
      setTargetDetailsItemLength((prev) => prev - 1);

      // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
      if (!selectedPerfFormTargetResponse || !isModalEdit) return;
      selectedPerfFormTargetResponse.dataTargetDetails.splice(itemIdx, 1);
    },
    [
      formik,
      dataPerfTypeItemIdx,
      dataCategoryIdx,
      selectedPerfFormTargetResponse,
      isModalEdit,
    ],
  );

  // handle behavior of other value if checkboxes is changes
  const handleCheckboxesOnChange = (
    checked: boolean | undefined,
    checkboxProperty: string,
  ) => {
    const clonedDataTarget = cloneDeep(
      formik?.values?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
        dataCategoryIdx
      ]?.dataTarget,
    );

    if (!clonedDataTarget) return;
    const newDataTargetValue = {
      ...clonedDataTarget,
      [checkboxProperty]: checked,
      dataTargetDetails: [],
    };

    setTargetDetailsItemLength(0);
    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataTarget`,
      newDataTargetValue,
    );

    if (checked && checkboxProperty === 'isUserDefine')
      checkedEditableInputCheckbox(checked);

    // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
    if (!selectedPerfFormTargetResponse || !isModalEdit) return;
    selectedPerfFormTargetResponse.dataTargetDetails.splice(
      0,
      selectedPerfFormTargetResponse.dataTargetDetails.length,
    );
  };

  // function to change the checkbox value of isEditable
  const checkedEditableInputCheckbox = (checked: boolean | undefined) => {
    if (!checked) return;

    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataTarget.isEditable`,
      true,
    );
  };

  // below are state and handler function that stores and handles local changes on target details dropdown to make it controlable
  const [everySelectedKPI, setEverySelectedKPI] = useState<DropdownOptions[]>(
    [],
  );

  const [everySelectedTarget, setEverySelectedTarget] = useState<
    DropdownOptions[]
  >([]);

  const gatherSelectedOptionToParent = (
    options: DropdownOptions[],
    optionType: 'kpi' | 'target',
  ) => {
    if (optionType === 'kpi')
      setEverySelectedKPI((prev) => uniqBy([...prev, ...options], 'key'));

    if (optionType === 'target')
      setEverySelectedTarget((prev) => uniqBy([...prev, ...options], 'key'));
  };

  return (
    <section>
      <Grid columns={'equal'} textAlign={'left'}>
        <Grid.Row>
          <Grid.Column>
            {!dataAllTargetIsUserDefine && (
              <>
                {targetDetailsItemLength > 0 && (
                  <Table color={'black'} singleLine compact>
                    <Table.Header>
                      <Table.Row>
                        <TableHeaderCell
                          width={5}
                          attribute={'kpi'}
                          name={'KPI'}
                          textAlign={'center'}
                        />
                        <TableHeaderCell
                          width={4}
                          attribute={'target'}
                          name={'Target'}
                          textAlign={'center'}
                        />
                        <Table.HeaderCell width={1} />
                      </Table.Row>
                    </Table.Header>
                    {Array(targetDetailsItemLength)
                      .fill(0)
                      .map((_, dataDetailTargetIdx) => (
                        <TargetOptionsTable
                          key={`target-option-table-${dataPerfTypeItemIdx}-${dataCategoryIdx}-${dataDetailTargetIdx}`}
                          isModalEdit={isModalEdit}
                          formik={formik}
                          dataPerfTypeItemIdx={dataPerfTypeItemIdx}
                          dataCategoryIdx={dataCategoryIdx}
                          detailTargetIdx={dataDetailTargetIdx}
                          removeDetail={() =>
                            deleteAdditionalDetailTarget(dataDetailTargetIdx)
                          }
                          everySelectedKPI={everySelectedKPI}
                          everySelectedTarget={everySelectedTarget}
                          gatherSelectedOptionToParent={
                            gatherSelectedOptionToParent
                          }
                        />
                      ))}
                  </Table>
                )}
              </>
            )}
            {!dataAllTargetIsUserDefine && (
              <Form.Field>
                <Button
                  basic
                  circular
                  color={'black'}
                  onClick={addAdditionalDetailTarget}
                >
                 New Item
                </Button>
              </Form.Field>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
};

type TargetOptionsTableProps = {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  dataPerfTypeItemIdx: number;
  dataCategoryIdx: number;
  detailTargetIdx: number;
  removeDetail: any;
  everySelectedKPI: DropdownOptions[];
  everySelectedTarget: DropdownOptions[];
  gatherSelectedOptionToParent: (
    options: DropdownOptions[],
    optionType: 'kpi' | 'target',
  ) => void;
};

const TargetOptionsTable = ({
  isModalEdit = false,
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
  detailTargetIdx,
  removeDetail,
  everySelectedKPI,
  everySelectedTarget,
  gatherSelectedOptionToParent,
}: TargetOptionsTableProps) => {
  const {
    initialOptionPerfKPIInDataTargetDetails,
    initialOptionPerfTargetInDataTargetDetails,
  } = usePerfFormContext();

  const selectedKPI =
    formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataTarget?.dataTargetDetails[detailTargetIdx]?.performanceKPI;

  const selectedTarget =
    formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataTarget?.dataTargetDetails[detailTargetIdx]?.performanceTarget;

  const uniqOptionKPI = useMemo(
    () =>
      uniqBy(
        [
          ...initialOptionPerfKPIInDataTargetDetails(
            dataPerfTypeItemIdx,
            dataCategoryIdx,
            detailTargetIdx,
          ),
          ...everySelectedKPI,
        ],
        'key',
      ).filter((option) => option.key === selectedKPI) ||
      ([] as DropdownOptions[]),
    [
      dataCategoryIdx,
      dataPerfTypeItemIdx,
      detailTargetIdx,
      everySelectedKPI,
      initialOptionPerfKPIInDataTargetDetails,
      selectedKPI,
    ],
  );

  const uniqOptionTarget = useMemo(
    () =>
      uniqBy(
        [
          ...initialOptionPerfTargetInDataTargetDetails(
            dataPerfTypeItemIdx,
            dataCategoryIdx,
            detailTargetIdx,
          ),
          ...everySelectedTarget,
        ],
        'key',
      ).filter((option) => option.key === selectedTarget) ||
      ([] as DropdownOptions[]),
    [
      dataCategoryIdx,
      dataPerfTypeItemIdx,
      detailTargetIdx,
      everySelectedTarget,
      initialOptionPerfTargetInDataTargetDetails,
      selectedTarget,
    ],
  );

  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell width={8}>
          <InputDropdownRemote
            placeholder={`Select KPI`}
            label={''}
            name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataTarget.dataTargetDetails[${detailTargetIdx}].performanceKPI`}
            formik={formik}
            apiFetcher={getPerfKPINameList}
            apiSearchKeys={['name']}
            apiTextKey={'name'}
            apiValueKey={'id'}
            style={{ position: 'relative' }}
            initialOptions={isModalEdit ? uniqOptionKPI : []}
            onChange={(data: any) =>
              gatherSelectedOptionToParent(
                [
                  {
                    key: data?.id,
                    text: data?.name,
                    value: data?.id,
                  },
                ],
                'kpi',
              )
            }
          />
        </Table.Cell>
        <Table.Cell width={8}>
          <InputDropdownRemote
            placeholder={`Select Target`}
            label={''}
            name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataTarget.dataTargetDetails[${detailTargetIdx}].performanceTarget`}
            formik={formik}
            apiFetcher={getPerfTargetNameList}
            apiSearchKeys={['name']}
            apiTextKey={'name'}
            apiValueKey={'id'}
            initialOptions={isModalEdit ? uniqOptionTarget : []}
            onChange={(data: any) =>
              gatherSelectedOptionToParent(
                [
                  {
                    key: data?.id,
                    text: data?.name,
                    value: data?.id,
                  },
                ],
                'target',
              )
            }
          />
        </Table.Cell>
        <Table.Cell width={15}>
          <Button
            icon="trash"
            basic
            compact
            size="small"
            color={'blue'}
            onClick={removeDetail}
          />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

export default TargetSectionPerfForm;
