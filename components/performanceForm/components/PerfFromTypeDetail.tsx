import { Button, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import React, { useCallback, useMemo, useState } from 'react';
import { FormikProps } from 'formik';
import InputDropdownRemote from '../../InputDropdownRemote';
import InputCheckbox from '../../InputCheckbox';
import { getPerfTypeList } from '../../../lib/data/performanceForm/usePerfTypeList';
import Input from '../../Input';
import { getPerfMeasurementList } from '../../../lib/data/performanceForm/usePerfMeasurementList';
import InputDropdownSimple from '../../InputDropdownSimple';
import {
  categoryWeight,
  // KPIWeight,
} from '../../../lib/data/performanceForm/finalResult';
import {
  CategoryConfiguration,
  PerfFromRequestDataFormProps,
} from '../types/perfForm';
import PerfFormCategoryDetail from './PerfFormCategoryDetail';
import { usePerfFormContext } from '../contexts/PerfFormContext';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { get } from 'lodash';

type PerformanceTypeSectionRequestProps = {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  perCategId?: string;
  loading: any;
  performanceProgram: any;
};
const PerfFromTypeDetail = ({
  isModalEdit = false,
  formik,
  loading,
  performanceProgram,
}: PerformanceTypeSectionRequestProps) => {
  const selectedPerfTypeArr = formik.values.dataPerfType;
  const [totalPerfFormTypeItem, setTotalPerfFormTypeItem] = useState<number>(0);
  const [selectedPerfProgramId, setSelectedPerfProgramId] = useState(
    performanceProgram.id,
  );

  const [prevTotalPerfFormTypeItem, setPrevTotalPerfFormTypeItem] =
    useState<number>(0);
  if (
    isModalEdit &&
    selectedPerfTypeArr &&
    !isEqual(selectedPerfTypeArr.length, prevTotalPerfFormTypeItem)
  ) {
    setPrevTotalPerfFormTypeItem(selectedPerfTypeArr.length);
    setTotalPerfFormTypeItem(selectedPerfTypeArr.length);
  }

  const { performanceForm } = usePerfFormContext();
  const selectedPerfFormTypeResponse = performanceForm?.dataPerfType;

  const addItem = useCallback(() => {
    if (!performanceProgram || Object.keys(performanceProgram).length <= 0)
      return;
    setTotalPerfFormTypeItem((prev) => prev + 1);
    const newFormikItems = [...formik.values.dataPerfType];
    newFormikItems?.push({
      dataCategory: [],
      isCategory: false,
      isCategoryWeightCalc: false,
      isKPIWeightCalc: false,
      isMidYearScore: false,
      weight: performanceProgram.finalResultMethod === 'MULTIPLE' ? '100' : '',
      isKRA: false,
      isTarget: false,
      order: totalPerfFormTypeItem,
    });
    formik.setFieldValue('dataPerfType', newFormikItems);
  }, [formik, performanceProgram, totalPerfFormTypeItem]);

  const deleteItem = useCallback(
    (item) => {
      setTotalPerfFormTypeItem((prev) => prev - 1);
      const clonedDataPerfType = cloneDeep(formik.values.dataPerfType);
      clonedDataPerfType.splice(item, 1);
      formik.setFieldValue(`dataPerfType`, clonedDataPerfType);
      if (!selectedPerfFormTypeResponse || !isModalEdit) return;
      selectedPerfFormTypeResponse.splice(item, 1);
    },
    [formik, isModalEdit, selectedPerfFormTypeResponse],
  );

  if (selectedPerfProgramId !== performanceProgram.id) {
    const clonedDataPerfType = cloneDeep(formik.values.dataPerfType);

    formik.setFieldValue(
      'dataPerfType',
      clonedDataPerfType.map((dataPerfType) => ({
        ...dataPerfType,
        isMidYearScore: false,
        weight:
          performanceProgram.finalResultMethod === 'MULTIPLE' ? '100' : '',
      })),
    );

    setSelectedPerfProgramId(performanceProgram.id);
  }


  return (
    <>
      <Form id={'perf-form-create-form'} loading={loading}>
        {performanceProgram &&
          totalPerfFormTypeItem > 0 &&
          Array(totalPerfFormTypeItem)
            .fill(0)
            .map((_, perfFormTypeIdx) => (
              <PerformanceTypeSection
                isModalEdit={isModalEdit}
                key={`performance-type-section-${perfFormTypeIdx}`}
                perfFormTypeIdx={perfFormTypeIdx}
                formik={formik}
                deleteItem={() => deleteItem(perfFormTypeIdx)}
                performanceProgram={performanceProgram}
              />
            ))}
      </Form>
      <Grid columns="equal" padded>
        <Grid.Column>
          <Button
            secondary
            circular
            size={'large'}
            type={'submit'}
            form={'perf-form-create-form'}
            onClick={addItem}
            disabled={
              !performanceProgram || Object.keys(performanceProgram).length <= 0
            }
          >
            Create Type of Performance
          </Button>
        </Grid.Column>
      </Grid>
    </>
  );
};

type PerformanceTypeSectionProps = {
  isModalEdit: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  perfFormTypeIdx: number;
  deleteItem: any;
  perfFormIds?: string[];
  setPerfFormIdsTaken?: any;
  performanceProgram?: any;
};

const defaultPerfFormTypeData = (
  isCategory: boolean,
  isKRA: boolean,
  isTarget: boolean,
): CategoryConfiguration => ({
  dataTarget: isTarget
    ? {
        localIsCategory: isCategory,
        localIsTarget: isTarget,
        isUserDefine: false,
        isEditable: false,
        dataTargetDetails: [],
      }
    : undefined,
  dataKRA: isKRA
    ? {
        localIsCategory: isCategory,
        localIsKRA: isKRA,
        isUserDefine: false,
        isEditable: false,
        isSelection: false,
        dataKRADetails: [],
      }
    : undefined,
  dataKPI: {
    isUserDefine: false,
    isEditable: false,
    isSelection: false,
    dataKPIDetails: [],
  },
  localIsCategory: isCategory,
  localIsKRA: isKRA,
  localIsTarget: isTarget,
  perfCategory: '',
  categoryWeight: '',
});

const PerformanceTypeSection = ({
  isModalEdit = false,
  formik,
  perfFormTypeIdx,
  deleteItem,
  performanceProgram,
}: PerformanceTypeSectionProps) => {
  const [showItem, setShowItem] = useState(true);
  const [singleWeight, setSingleWeight] = useState(false);
  const [perfFormTypeName] = useState(
    `PERFORMANCE TYPE ${perfFormTypeIdx + 1}`,
  );

  // this is selected data category from formik
  const selectedPerfCategory =
    formik.values?.dataPerfType[perfFormTypeIdx]?.dataCategory;
  const [totalPerfFormCategoryItem, setTotalPerfFormCategoryItem] =
    useState<number>(0);

  // sync totalPerfFormCategoryItem with its formik
  const [prevTotalPerfFormCategoryItem, setPrevTotalPerfFormCategoryItem] =
    useState<number>(0);
  if (
    isModalEdit &&
    selectedPerfCategory &&
    !isEqual(selectedPerfCategory.length, prevTotalPerfFormCategoryItem)
  ) {
    setPrevTotalPerfFormCategoryItem(selectedPerfCategory?.length);
    setTotalPerfFormCategoryItem(selectedPerfCategory?.length);
  }

  const {
    performanceForm, // perf form API response
    initialOptionPerfType,
    initialOptionPerfMeasurement,
  } = usePerfFormContext();
  const selectedPerfCategoryResponse =
    performanceForm?.dataPerfType[perfFormTypeIdx]?.dataCategory;

  // local state of isCategory
  const isActiveCategory = useMemo(() => {
    return formik.values?.dataPerfType[perfFormTypeIdx]?.isCategory;
  }, [formik?.values, perfFormTypeIdx]);

  // local state of isKRA
  const isKRAButton = useMemo(() => {
    return formik.values?.dataPerfType[perfFormTypeIdx]?.isKRA;
  }, [formik?.values, perfFormTypeIdx]);

  // local state of isTarget
  const isTargetButton = useMemo(() => {
    return formik.values?.dataPerfType[perfFormTypeIdx]?.isTarget;
  }, [formik?.values, perfFormTypeIdx]);

  // check if perf type is able to create more category
  const isAbleToCreateMoreCategory = useMemo(() => {
    return isActiveCategory ? true : totalPerfFormCategoryItem < 1;
  }, [isActiveCategory, totalPerfFormCategoryItem]);

  // add additional data with type category
  const addAdditionalDetail = useCallback(() => {
    setTotalPerfFormCategoryItem((prev) => prev + 1);
    const clonedDataPerfType = cloneDeep(formik.values.dataPerfType);
    const curDataCategory = clonedDataPerfType[perfFormTypeIdx]?.dataCategory;
    curDataCategory?.push(
      defaultPerfFormTypeData(isActiveCategory, isKRAButton, isTargetButton),
    );
    clonedDataPerfType[perfFormTypeIdx].dataCategory = curDataCategory;
    formik.setFieldValue('dataPerfType', clonedDataPerfType);
  }, [formik, perfFormTypeIdx, isActiveCategory, isKRAButton, isTargetButton]);

  // remove selected aditional data
  const deleteAdditionalDetail = useCallback(
    (itemDetailIdx) => {
      setTotalPerfFormCategoryItem((prev) => prev - 1);
      const clonedDataPerfType = cloneDeep(formik.values.dataPerfType);
      const curDataCategory = clonedDataPerfType[perfFormTypeIdx]?.dataCategory;
      curDataCategory.splice(itemDetailIdx, 1);
      clonedDataPerfType[perfFormTypeIdx].dataCategory = curDataCategory;
      formik.setFieldValue('dataPerfType', clonedDataPerfType);

      // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
      if (!selectedPerfCategoryResponse || !isModalEdit) return;
      selectedPerfCategoryResponse.splice(itemDetailIdx, 1);
    },
    [formik, isModalEdit, perfFormTypeIdx, selectedPerfCategoryResponse],
  );

  // handle behavior of other value if checkboxes is changes
  const handleCheckboxesOnChange = (
    checked: boolean | undefined,
    checkboxProperty: string,
  ) => {
    const clonedDataPerfType = cloneDeep(formik.values?.dataPerfType);
    setTotalPerfFormCategoryItem(0);
    clonedDataPerfType[perfFormTypeIdx].dataCategory = [];
    if (checkboxProperty === 'isCategory') {
      clonedDataPerfType[perfFormTypeIdx].isCategory = !!checked;
      clonedDataPerfType[perfFormTypeIdx].isCategoryWeightCalc = false;
    }
    if (checkboxProperty === 'isKRA')
      clonedDataPerfType[perfFormTypeIdx].isKRA = !!checked;
    if (checkboxProperty === 'isTarget')
      clonedDataPerfType[perfFormTypeIdx].isTarget = !!checked;
    formik.setFieldValue('dataPerfType', clonedDataPerfType);

    // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
    if (!selectedPerfCategoryResponse || !isModalEdit) return;
    selectedPerfCategoryResponse.splice(0, selectedPerfCategory.length);
  };
  const typeWeight = useMemo(() => {
    if (performanceProgram.finalResultMethod !== 'SINGLE') {
      return false;
    }

    const curValue = get(formik.values, 'dataPerfType') || [];
    const totalWeightAll = curValue.reduce(
      (prev, currItem) => prev + (Number(currItem.weight) || 0),
      0,
    );
    if (totalWeightAll == 0) setSingleWeight(true);
    else setSingleWeight(false);
    const isValue = totalWeightAll !== 100 && totalWeightAll > 0;

    return isValue;
  }, [formik.values, performanceProgram.finalResultMethod, singleWeight]);

  return (
    <Segment padded={showItem}>
      <Grid columns={'equal'}>
        <Grid.Row className={showItem ? 'nopaddingb' : ''}>
          <Grid.Column verticalAlign="middle">
            <Header size={'small'} color={'blue'}>
              {perfFormTypeName}
            </Header>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Button
              size={'tiny'}
              floated="right"
              basic
              icon
              onClick={deleteItem}
            >
              <Icon name="trash" />
            </Button>
            <Button
              size={'tiny'}
              floated="right"
              onClick={() => setShowItem(!showItem)}
              basic
              icon
            >
              <Icon name={showItem ? 'angle down' : 'angle up'} />
            </Button>
          </Grid.Column>
        </Grid.Row>
        {/* Perf Type Content */}
        <Grid.Row className={!showItem ? 'display-none' : ''}>
          <Grid.Column>
            {performanceProgram.formTerm === 'MID_END_YEAR' && (
              <InputCheckbox
                name={`dataPerfType[${perfFormTypeIdx}].isMidYearScore`}
                formik={formik}
                label={'With Mid Year'}
                color={'blue'}
              />
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className={!showItem ? 'display-none' : ''}>
          <Grid.Column>
            <InputDropdownRemote
              placeholder={`Choose Performance Type`}
              label={'Performance Type'}
              name={`dataPerfType[${perfFormTypeIdx}].perfTypeId`}
              formik={formik}
              apiFetcher={getPerfTypeList}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'id'}
              initialOptions={
                isModalEdit ? initialOptionPerfType(perfFormTypeIdx) : []
              }
            />
          </Grid.Column>
          <Grid.Column>
            <Input
              placeholder={'Insert Weight'}
              label={'Performance Type Weight'}
              formik={formik}
              type={'number'}
              name={`dataPerfType[${perfFormTypeIdx}].weight`}
              labelProps={{ basic: true, content: '%' }}
              isNumber={true}
              disabled={performanceProgram.finalResultMethod === 'MULTIPLE'}
            />
            <p className="lna-survey-error">
              {' '}
              {typeWeight
                ? 'Please ensure that the total weight across all performance types equals 100.'
                : ''}
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className={!showItem ? 'display-none' : ''}>
          <Grid.Column>
            <InputDropdownRemote
              placeholder={`Choose Measurement Template`}
              label={`Measurement Template`}
              name={`dataPerfType[${perfFormTypeIdx}].perfMeasurementTempId`}
              formik={formik}
              apiFetcher={getPerfMeasurementList}
              apiSearchKeys={['templateName']}
              apiTextKey={'templateName'}
              apiValueKey={'id'}
              initialOptions={
                isModalEdit ? initialOptionPerfMeasurement(perfFormTypeIdx) : []
              }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className={!showItem ? 'display-none' : ''}>
          <Grid.Column>
            <InputCheckbox
              formik={formik}
              label={'Category'}
              name={`dataPerfType[${perfFormTypeIdx}].isCategory`}
              color={'blue'}
              onChangeCb={(checked: boolean | undefined) =>
                handleCheckboxesOnChange(checked, 'isCategory')
              }
            />
          </Grid.Column>
          <Grid.Column>
            <InputCheckbox
              formik={formik}
              label={'KRA'}
              name={`dataPerfType[${perfFormTypeIdx}].isKRA`}
              color={'blue'}
              onChangeCb={(checked: boolean | undefined) =>
                handleCheckboxesOnChange(checked, 'isKRA')
              }
            />
          </Grid.Column>
          <Grid.Column>
            <InputCheckbox
              formik={formik}
              label={'Target'}
              name={`dataPerfType[${perfFormTypeIdx}].isTarget`}
              color={'blue'}
              onChangeCb={(checked: boolean | undefined) =>
                handleCheckboxesOnChange(checked, 'isTarget')
              }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className={!showItem ? 'display-none' : ''} columns="equal">
          <Grid.Column>
            <InputDropdownSimple
              placeholder={`Category Weight`}
              label={`Category Weight`}
              name={`dataPerfType[${perfFormTypeIdx}].isCategoryWeightCalc`}
              formik={formik}
              options={categoryWeight}
              disabled={isActiveCategory === false}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className={!showItem ? 'display-none' : ''}>
          <Grid.Column>
            {Array(totalPerfFormCategoryItem)
              .fill(0)
              .map((_, perfFormCategoryIdx) => (
                <PerfFormCategoryDetail
                  key={`perf-form-category-detail-${perfFormCategoryIdx}`}
                  isModalEdit={isModalEdit}
                  formik={formik}
                  perfFormTypeIdx={perfFormTypeIdx}
                  perfFormCategoryIdx={perfFormCategoryIdx}
                  isCategoryButtonActive={isActiveCategory}
                  isKRAButtonActive={isKRAButton}
                  isTargetButtonActive={isTargetButton}
                  removeAdditionalDetail={() =>
                    deleteAdditionalDetail(perfFormCategoryIdx)
                  }
                />
              ))}
          </Grid.Column>
        </Grid.Row>
        {isAbleToCreateMoreCategory && (
          <Grid.Row className={!showItem ? 'display-none' : ''}>
            <Grid.Column>
              <Button
                circular
                color={'blue'}
                onClick={addAdditionalDetail}
                disabled={typeWeight || singleWeight}
              >
                New Category
              </Button>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </Segment>
  );
};

export default PerfFromTypeDetail;
