import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form, Grid, Icon, Table } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import InputDropdownRemote from '../../InputDropdownRemote';
import InputCheckbox from '../../InputCheckbox';
import { getPerfKRANameList } from '../../../lib/data/performanceForm/usePerfKRANameList';
import { PerfFromRequestDataFormProps } from '../types/perfForm';
import TableHeaderCell from '../../TableHeaderCell';
import { usePerfFormContext } from '../contexts/PerfFormContext';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';
import DropdownOptions from '../../../lib/types/DropdownOptions';

interface KRADetailProps {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  dataPerfTypeItemIdx: any;
  dataCategoryIdx: any;
}

const defaultDataKRADetail = (isPredefined: boolean) => ({
  isPredefine: isPredefined,
  performanceKRA: '',
});

const KRASectionPerfForm = ({
  isModalEdit,
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
}: KRADetailProps) => {
  // this is selected data KRA from formik
  const selectedDataKRA =
    formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKRA;
  const [KRADetailsItemLength, setKRADetailsItemLength] = useState<number>(0);

  // sync KRADetailsItemLength with its formik length
  const [prevKRADetailsItemLength, setPrevKRADetailsItemLength] =
    useState<number>(0);
  if (
    isModalEdit &&
    selectedDataKRA?.dataKRADetails &&
    !isEqual(selectedDataKRA.dataKRADetails.length, prevKRADetailsItemLength)
  ) {
    setPrevKRADetailsItemLength(selectedDataKRA.dataKRADetails.length);
    setKRADetailsItemLength(selectedDataKRA.dataKRADetails.length);
  }

  // perf form API response
  const { performanceForm } = usePerfFormContext();
  const selectedPerfFormKRAResponse =
    performanceForm?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKRA;

  // local state of isUserDefine
  const dataAllKRAIsUserDefine = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKRA?.isUserDefine;
  }, [dataCategoryIdx, formik?.values, dataPerfTypeItemIdx]);

  // local state of isSelection
  const dataAllKRAIsSelection = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKRA?.isSelection;
  }, [formik?.values, dataPerfTypeItemIdx, dataCategoryIdx]);

  // local state which store condition to display Performance KRA table
  const displayPerformanceKRATable = useMemo(
    () => !dataAllKRAIsUserDefine && dataAllKRAIsSelection,
    [dataAllKRAIsSelection, dataAllKRAIsUserDefine],
  );

  // local state which store condition to display only Performance KRA dropdown
  const displayPerformanceKRADropdown = useMemo(
    () =>
      (dataAllKRAIsUserDefine && dataAllKRAIsSelection) ||
      (!dataAllKRAIsUserDefine && !displayPerformanceKRATable),
    [dataAllKRAIsSelection, dataAllKRAIsUserDefine, displayPerformanceKRATable],
  );

  // function to handle addition of new additional detail
  const addAdditionalDetail = useCallback(() => {
    setKRADetailsItemLength((prev) => prev + 1);
    const clonedDataKRA = cloneDeep(
      formik.values?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
        dataCategoryIdx
      ]?.dataKRA,
    );

    if (!clonedDataKRA) return;
    const isPredefined = !dataAllKRAIsUserDefine && !dataAllKRAIsSelection;
    clonedDataKRA.dataKRADetails.push(defaultDataKRADetail(isPredefined));
    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA`,
      clonedDataKRA,
    );
  }, [
    dataAllKRAIsSelection,
    dataAllKRAIsUserDefine,
    dataCategoryIdx,
    dataPerfTypeItemIdx,
    formik,
  ]);

  // function to handle deletion of selected additional detail
  const deleteAdditionalDetail = useCallback(
    (itemIdx) => {
      const clonedDataKRA = cloneDeep(
        formik.values?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataKRA,
      );

      if (!clonedDataKRA) return;
      const clonedDataKRADetails = clonedDataKRA.dataKRADetails;
      clonedDataKRADetails.splice(itemIdx, 1);
      formik.setFieldValue(
        `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA.dataKRADetails`,
        clonedDataKRADetails,
      );
      setKRADetailsItemLength((prev) => prev - 1);

      // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
      if (!selectedPerfFormKRAResponse || !isModalEdit) return;
      selectedPerfFormKRAResponse.dataKRADetails.splice(itemIdx, 1);
    },
    [
      formik,
      dataPerfTypeItemIdx,
      dataCategoryIdx,
      selectedPerfFormKRAResponse,
      isModalEdit,
    ],
  );

  // handle behavior of other value if checkboxes is changes
  const handleCheckboxesOnChange = (
    checked: boolean | undefined,
    checkboxProperty: string,
  ) => {
    const clonedDataKRA = cloneDeep(
      formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
        dataCategoryIdx
      ]?.dataKRA,
    );

    if (!clonedDataKRA) return;
    const newDataKRAValue = {
      ...clonedDataKRA,
      [checkboxProperty]: checked,
      dataKRADetails: [],
    };

    setKRADetailsItemLength(0);
    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA`,
      newDataKRAValue,
    );

    if (
      checked &&
      (checkboxProperty === 'isUserDefine' ||
        checkboxProperty === 'isSelection')
    )
      checkedEditableInputCheckbox(checked);

    // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
    if (!selectedPerfFormKRAResponse || !isModalEdit) return;
    selectedPerfFormKRAResponse.dataKRADetails.splice(
      0,
      selectedPerfFormKRAResponse.dataKRADetails.length,
    );
  };

  // function to change the checkbox value of isEditable
  const checkedEditableInputCheckbox = (checked: boolean | undefined) => {
    if (!checked) return;

    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA.isEditable`,
      true,
    );
  };

  // below are state and handler function that stores and handles local changes on kra details dropdown to make it controable
  const [everySelectedKRA, setEverySelectedKRA] = useState<DropdownOptions[]>(
    [],
  );

  const gatherSelectedOptionToParent = (options: DropdownOptions[]) => {
    setEverySelectedKRA((prev) => uniqBy([...prev, ...options], 'key'));
  };

  return (
    <section>
      <Grid columns={'equal'} textAlign={'left'}>
        <Grid.Row>
          <Grid.Column>
            <div>
              {displayPerformanceKRADropdown && (
                <>
                  {KRADetailsItemLength > 0 && (
                    <>
                      {' '}
                      <label
                        style={{
                          fontSize: '12px',
                          marginTop: '2px',
                          marginBottom: '10px',
                          fontWeight: 'lighter',
                        }}
                      >
                        KRA Name
                      </label>
                    </>
                  )}

                  {Array(KRADetailsItemLength)
                    .fill(0)
                    .map((_, dataDetailKRAIdx) => (
                      <>
                        <KRAOptionsDropdown
                          key={`kra-options-dropdown-${dataPerfTypeItemIdx}-${dataCategoryIdx}-${dataDetailKRAIdx}`}
                          isModalEdit={isModalEdit}
                          formik={formik}
                          dataPerfTypeItemIdx={dataPerfTypeItemIdx}
                          dataCategoryIdx={dataCategoryIdx}
                          detailKRAIdx={dataDetailKRAIdx}
                          removeDetail={() =>
                            deleteAdditionalDetail(dataDetailKRAIdx)
                          }
                          everySelectedKRA={everySelectedKRA}
                          gatherSelectedOptionToParent={
                            gatherSelectedOptionToParent
                          }
                        />
                      </>
                    ))}
                </>
              )}
              {displayPerformanceKRATable && (
                <>
                  {KRADetailsItemLength > 0 && (
                    <Table color={'teal'} singleLine compact>
                      <Table.Header>
                        <Table.Row>
                          <TableHeaderCell
                            width={5}
                            attribute={'kra'}
                            name={'KRA'}
                            textAlign={'center'}
                          />
                          <TableHeaderCell
                            width={4}
                            attribute={'predefine'}
                            name={'Predefine'}
                            textAlign={'center'}
                          />
                          <Table.HeaderCell width={1} />
                        </Table.Row>
                      </Table.Header>
                      {Array(KRADetailsItemLength)
                        .fill(0)
                        .map((_, dataDetailKRAIdx) => (
                          <KRAOptionsTable
                            key={`kra-options-table-${dataPerfTypeItemIdx}-${dataCategoryIdx}-${dataDetailKRAIdx}`}
                            isModalEdit={isModalEdit}
                            formik={formik}
                            dataPerfTypeItemIdx={dataPerfTypeItemIdx}
                            dataCategoryIdx={dataCategoryIdx}
                            detailKRAIdx={dataDetailKRAIdx}
                            removeDetail={() =>
                              deleteAdditionalDetail(dataDetailKRAIdx)
                            }
                            everySelectedKRA={everySelectedKRA}
                            gatherSelectedOptionToParent={
                              gatherSelectedOptionToParent
                            }
                          />
                        ))}
                    </Table>
                  )}
                </>
              )}
              {(displayPerformanceKRADropdown ||
                displayPerformanceKRATable) && (
                <Form.Field>
                  <Button
                    basic
                    circular
                    color={'black'}
                    onClick={addAdditionalDetail}
                  >
                    New Item
                  </Button>
                </Form.Field>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
};

type KRAOptionsDropdownProps = {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  dataPerfTypeItemIdx: number;
  dataCategoryIdx: number;
  detailKRAIdx: number;
  removeDetail: any;
  everySelectedKRA: DropdownOptions[];
  gatherSelectedOptionToParent: (options: DropdownOptions[]) => void;
};

const KRAOptionsDropdown = ({
  isModalEdit = false,
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
  detailKRAIdx,
  removeDetail,
  everySelectedKRA,
  gatherSelectedOptionToParent,
}: KRAOptionsDropdownProps) => {
  const { initialOptionPerfKRAInDataKRADetails } = usePerfFormContext();

  const selectedKRA =
    formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKRA?.dataKRADetails[detailKRAIdx]?.performanceKRA;

  const uniqOptionKRA = useMemo(
    () =>
      uniqBy(
        [
          ...initialOptionPerfKRAInDataKRADetails(
            dataPerfTypeItemIdx,
            dataCategoryIdx,
            detailKRAIdx,
          ),
          ...everySelectedKRA,
        ],
        'key',
      ).filter((option) => option.key === selectedKRA) ||
      ([] as DropdownOptions[]),
    [
      dataCategoryIdx,
      dataPerfTypeItemIdx,
      detailKRAIdx,
      everySelectedKRA,
      initialOptionPerfKRAInDataKRADetails,
      selectedKRA,
    ],
  );

  return (
    <Form.Field>
      <Grid>
        <Grid.Row>
          <Grid.Column width={15}>
            <InputDropdownRemote
              placeholder={`Select KRA Name`}
              label={``}
              name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA.dataKRADetails[${detailKRAIdx}].performanceKRA`}
              formik={formik}
              apiFetcher={getPerfKRANameList}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'id'}
              initialOptions={isModalEdit ? uniqOptionKRA : []}
              onChange={(data: any) =>
                gatherSelectedOptionToParent([
                  {
                    key: data?.id,
                    text: data?.name,
                    value: data?.id,
                  },
                ])
              }
            />
          </Grid.Column>
          <Grid.Column width={1} textAlign={'right'}>
            <Form.Field>
              <Button.Group
                icon
                basic
                color={'blue'}
                style={{ marginTop: '5px' }}
              >
                <Button onClick={removeDetail} icon={'trash'} />
              </Button.Group>
            </Form.Field>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form.Field>
  );
};

type KRAOptionsTableProps = {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  dataPerfTypeItemIdx: number;
  dataCategoryIdx: number;
  detailKRAIdx: number;
  removeDetail: any;
  everySelectedKRA: DropdownOptions[];
  gatherSelectedOptionToParent: (options: DropdownOptions[]) => void;
};

const KRAOptionsTable = ({
  isModalEdit = false,
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
  detailKRAIdx,
  removeDetail,
  everySelectedKRA,
  gatherSelectedOptionToParent,
}: KRAOptionsTableProps) => {
  const { initialOptionPerfKRAInDataKRADetails } = usePerfFormContext();

  const selectedKRA =
    formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKRA?.dataKRADetails[detailKRAIdx]?.performanceKRA;

  const uniqOptionKRA = useMemo(
    () =>
      uniqBy(
        [
          ...initialOptionPerfKRAInDataKRADetails(
            dataPerfTypeItemIdx,
            dataCategoryIdx,
            detailKRAIdx,
          ),
          ...everySelectedKRA,
        ],
        'key',
      ).filter((option) => option.key === selectedKRA) ||
      ([] as DropdownOptions[]),
    [
      dataCategoryIdx,
      dataPerfTypeItemIdx,
      detailKRAIdx,
      everySelectedKRA,
      initialOptionPerfKRAInDataKRADetails,
      selectedKRA,
    ],
  );

  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell width={15}>
          <InputDropdownRemote
            placeholder={`Select KRA Name`}
            label={``}
            name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA.dataKRADetails[${detailKRAIdx}].performanceKRA`}
            formik={formik}
            apiFetcher={getPerfKRANameList}
            apiSearchKeys={['name']}
            apiTextKey={'name'}
            apiValueKey={'id'}
            initialOptions={isModalEdit ? uniqOptionKRA : []}
            onChange={(data: any) =>
              gatherSelectedOptionToParent([
                {
                  key: data?.id,
                  text: data?.name,
                  value: data?.id,
                },
              ])
            }
          />
        </Table.Cell>
        <Table.Cell width={8}>
          <Form.Field style={{ marginTop: '0px' }}>
            <InputCheckbox
              formik={formik}
              label={'Predefine'}
              color={'green'}
              name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKRA.dataKRADetails[${detailKRAIdx}].isPredefine`}
            />
          </Form.Field>
        </Table.Cell>
        <Table.Cell width={15}>
          <Button
            size={'tiny'}
            floated="right"
            basic
            icon
            onClick={removeDetail}
            primary
          >
            <Icon name="trash" />
          </Button>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

export default KRASectionPerfForm;
