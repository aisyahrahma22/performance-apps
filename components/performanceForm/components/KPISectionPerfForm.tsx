import React, { useCallback, useMemo, useState } from 'react';
import {  Form, Grid,} from 'semantic-ui-react';
import { FormikProps } from 'formik';
import InputCheckbox from '../../InputCheckbox';
import Input from '../../Input';
import { PerfFromRequestDataFormProps } from '../types/perfForm';
import {
  maxKPICountList,
  maxKPIWeightList,
} from '../../../lib/data/performanceForm/finalResult';
import cloneDeep from 'lodash/cloneDeep';
import { usePerfFormContext } from '../contexts/PerfFormContext';
import { isEqual} from 'lodash';

interface KPIDetailProps {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  dataPerfTypeItemIdx: any;
  dataCategoryIdx: any;
  isCategoryButtonActive: boolean;
  isKRAButton: boolean;
}

const defaultDataKPIDetail = (isKRAButton: boolean, isPredefined: boolean) => ({
  localIsKRA: isKRAButton,
  isPredefine: isPredefined,
  weight: '',
  performanceKPI: '',
  performanceKRA: '',
});

const KPISectionPerfForm = ({
  isModalEdit,
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
  isKRAButton,
}: KPIDetailProps) => {
  // this is selected data KPI from formik
  const selectedDataKPI =
    formik.values?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKPI;
  const [KPIDetailsItemLength, setKPIDetailsItemLength] = useState<number>(0);

  // sync KPIDetailsItemLength with its formik length
  const [prevKPIDetailsItemLength, setPrevKPIDetailsItemLength] =
    useState<number>(0);
  if (
    isModalEdit &&
    selectedDataKPI?.dataKPIDetails &&
    !isEqual(selectedDataKPI.dataKPIDetails.length, prevKPIDetailsItemLength)
  ) {
    setPrevKPIDetailsItemLength(selectedDataKPI.dataKPIDetails.length);
    setKPIDetailsItemLength(selectedDataKPI.dataKPIDetails.length);
  }

  // perf form API response
  const { performanceForm } = usePerfFormContext();
  const selectedPerfFormKPIResponse =
    performanceForm?.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKPI;

  // isUserDefine local state
  const dataAllKPIIsUserDefine = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKPI?.isUserDefine;
  }, [dataCategoryIdx, formik?.values, dataPerfTypeItemIdx]);

  // isSelection local state
  const dataAllKPIIsSelection = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKPI?.isSelection;
  }, [formik?.values, dataPerfTypeItemIdx, dataCategoryIdx]);

  // local state which store condition to display KPI Option
  const displayKPIOption = useMemo(
    () =>
      (!dataAllKPIIsUserDefine && !dataAllKPIIsSelection) ||
      dataAllKPIIsSelection,
    [dataAllKPIIsSelection, dataAllKPIIsUserDefine],
  );

  // local state which store condition to display KPI Setting
  const displayKPISetting = useMemo(
    () => dataAllKPIIsUserDefine,
    [dataAllKPIIsUserDefine],
  );

  // function to handle addition of new additional detail
  const addAdditionalDetail = useCallback(() => {
    setKPIDetailsItemLength((prev) => prev + 1);
    const clonedDataKPI = cloneDeep(
      formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
        dataCategoryIdx
      ]?.dataKPI,
    );

    if (!clonedDataKPI) return;
    const isPredefined = !dataAllKPIIsUserDefine && !dataAllKPIIsSelection;
    clonedDataKPI.dataKPIDetails.push(
      defaultDataKPIDetail(isKRAButton, isPredefined),
    );
    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI`,
      clonedDataKPI,
    );
  }, [
    formik,
    dataPerfTypeItemIdx,
    dataCategoryIdx,
    dataAllKPIIsUserDefine,
    dataAllKPIIsSelection,
    isKRAButton,
  ]);

  // function to handle deletion of selected additional detail
  const deleteAdditionalDetail = useCallback(
    (itemIdx) => {
      const clonedDataKPI = cloneDeep(
        formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataKPI,
      );

      if (!clonedDataKPI) return;
      const clonedDataKPIDetails = clonedDataKPI.dataKPIDetails;
      clonedDataKPIDetails.splice(itemIdx, 1);
      formik.setFieldValue(
        `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.dataKPIDetails`,
        clonedDataKPIDetails,
      );
      setKPIDetailsItemLength((prev) => prev - 1);

      // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
      if (!selectedPerfFormKPIResponse || !isModalEdit) return;
      selectedPerfFormKPIResponse.dataKPIDetails.splice(itemIdx, 1);
    },
    [
      formik,
      dataPerfTypeItemIdx,
      dataCategoryIdx,
      selectedPerfFormKPIResponse,
      isModalEdit,
    ],
  );

  // handle behavior of other value if checkboxes is changes
  const handleCheckboxesOnChange = (
    checked: boolean | undefined,
    checkboxProperty: string,
  ) => {
    const defaultDataKPI = {
      typeMaxKPICount: '',
      typeMaxKPIWeight: '',
      minKPICountInput: '',
      maxKPICountInput: '',
      minKPIWeightInput: '',
      maxKPIWeightInput: '',
    };

    const clonedDataKPI = cloneDeep(
      formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
        dataCategoryIdx
      ]?.dataKPI,
    );
    if (!clonedDataKPI) return;
    const newDataKPIValue = {
      ...clonedDataKPI,
      [checkboxProperty]: checked,
      ...(checkboxProperty === 'isUserDefine' && checked && defaultDataKPI),
      dataKPIDetails: [],
    };

    setKPIDetailsItemLength(0);
    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI`,
      newDataKPIValue,
    );

    if (
      checked &&
      (checkboxProperty === 'isUserDefine' ||
        checkboxProperty === 'isSelection')
    )
      checkedEditableInputCheckbox(checked);

    // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
    if (!selectedPerfFormKPIResponse || !isModalEdit) return;
    selectedPerfFormKPIResponse.dataKPIDetails = [];

    // Important: also remove coresponding data from API because it is used as lookup to map saved dropdown data
    if (!selectedPerfFormKPIResponse || !isModalEdit) return;
    selectedPerfFormKPIResponse.dataKPIDetails.splice(
      0,
      selectedPerfFormKPIResponse.dataKPIDetails.length,
    );
  };

  // function to change the checkbox value of isEditable
  const checkedEditableInputCheckbox = (checked: boolean | undefined) => {
    if (!checked) return;

    formik.setFieldValue(
      `dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.isEditable`,
      true,
    );
  };
  
  return (
    <section>
      <Grid columns={'equal'} textAlign={'left'}>
        <Grid.Row>
          <Grid.Column>
            <InputCheckbox
              formik={formik}
              label={'User Define'}
              color={'green'}
              name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.isUserDefine`}
              onChangeCb={(checked) =>
                handleCheckboxesOnChange(checked, 'isUserDefine')
              }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div>
              {/* form for type user define */}
              {displayKPISetting && (
                <KPISetting
                  formik={formik}
                  dataPerfTypeItemIdx={dataPerfTypeItemIdx}
                  dataCategoryIdx={dataCategoryIdx}
                />
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
};

type KPISettingProps = {
  formik: FormikProps<PerfFromRequestDataFormProps>;
  dataPerfTypeItemIdx: number;
  dataCategoryIdx: number;
};

const KPISetting = ({
  formik,
  dataPerfTypeItemIdx,
  dataCategoryIdx,
}: KPISettingProps) => {
  const dataAllKPIMaxCount = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKPI?.typeMaxKPICount;
  }, [formik?.values, dataPerfTypeItemIdx, dataCategoryIdx]);

  const dataAllKPIMaxWeight = useMemo(() => {
    return formik.values.dataPerfType[dataPerfTypeItemIdx]?.dataCategory[
      dataCategoryIdx
    ]?.dataKPI?.typeMaxKPIWeight;
  }, [formik?.values, dataPerfTypeItemIdx, dataCategoryIdx]);

  return (
    <Form.Field>
      <Grid columns={'equal'} textAlign={'left'}>
        <Grid.Row>
          <Grid.Column width={15}>
            <Input
              placeholder={`Maximum KPI Count`}
              label={`Max KPI`}
              name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.typeMaxKPICount`}
              formik={formik}
              select
              options={maxKPICountList}
            />
          </Grid.Column>
        </Grid.Row>
        {dataAllKPIMaxCount === 'LIMITED' && (
          <Grid.Row>
            <Grid.Column width={8}>
              <Input
                placeholder={`Minimum Input`}
                label={`Min Input`}
                name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.minKPICountInput`}
                formik={formik}
                type={'number'}
                isNumber={true}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <Input
                placeholder={`Maximum Input`}
                label={`Max Input`}
                name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.maxKPICountInput`}
                formik={formik}
                type={'number'}
                isNumber={true}
              />
            </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column width={15}>
            <Input
              placeholder={`Maximum KPI Weight`}
              label={`Max KPI Weight`}
              name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.typeMaxKPIWeight`}
              formik={formik}
              select
              options={maxKPIWeightList}
            />
          </Grid.Column>
        </Grid.Row>
        {dataAllKPIMaxWeight === 'LIMITED' && (
          <Grid.Row>
            <Grid.Column width={8}>
              <Input
                placeholder={`Minimum Weight`}
                label={`Min Weight`}
                name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.minKPIWeightInput`}
                formik={formik}
                type={'number'}
                isNumber={true}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <Input
                placeholder={`Maximum Weight`}
                label={`Max Weight`}
                name={`dataPerfType[${dataPerfTypeItemIdx}].dataCategory[${dataCategoryIdx}].dataKPI.maxKPIWeightInput`}
                formik={formik}
                type={'number'}
                isNumber={true}
              />
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </Form.Field>
  );
};

export default KPISectionPerfForm;
