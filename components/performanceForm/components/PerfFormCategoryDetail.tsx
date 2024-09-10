import { FormikProps } from 'formik';
import React, { useState, useCallback } from 'react';
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { PerfFromRequestDataFormProps } from '../types/perfForm';
import { getPerfCategoryNameList } from '../../../lib/data/performanceForm/usePerfCategoryNameList';
import Input from '../../Input';
import KPISectionPerfForm from './KPISectionPerfForm';
import KRASectionPerfForm from './KRASectionPerfForm';
import TargetSectionPerfForm from './TargetSectionPerfForm';
import InputDropdownRemote from '../../InputDropdownRemote';
import { usePerfFormContext } from '../contexts/PerfFormContext';
type SlotDetailsProps = {
  isModalEdit?: boolean;
  formik: FormikProps<PerfFromRequestDataFormProps>;
  perfFormTypeIdx: number;
  isCategoryButtonActive: boolean;
  isKRAButtonActive: boolean;
  isTargetButtonActive: boolean;
  perfFormCategoryIdx: number;
  removeAdditionalDetail: () => void;
  initialOrg?: {
    key: any;
    value: any;
    text: any;
  }[];
};
export default function PerfFormCategoryDetails({
  isModalEdit = false,
  formik,
  perfFormTypeIdx,
  perfFormCategoryIdx,
  isCategoryButtonActive,
  isKRAButtonActive,
  isTargetButtonActive,
  removeAdditionalDetail,
}: SlotDetailsProps) {
  const { initialOptionPerfCategory } = usePerfFormContext();
  const [showItem, setShowItem] = useState(true); // state to determine if item is shown or not
  const [activeIndex, setActiveIndex] = useState(-1); // state to determine what tab (KRA, KPI, Target) is active
  const handleChangeTab = useCallback(
    (data: number) => {
      setActiveIndex(data);
    },
    [setActiveIndex],
  );

  return (
    <div>
       <Grid columns={'equal'}>
        <Grid.Row>
          <Grid.Column verticalAlign="middle">
            <Header size="small">
              {isCategoryButtonActive
                ? `${perfFormCategoryIdx + 1}. Category`
                : `No Category`}
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Button
              size={'tiny'}
              floated="right"
              onClick={removeAdditionalDetail}
              basic
              icon
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
        {/* Category definition inputs */}
        {isCategoryButtonActive && (
          <Grid.Row
            className={!showItem ? 'display-none' : ''}
            columns={'equal'}
          >
            <Grid.Column>
              <InputDropdownRemote
                placeholder={`Choose Category Name`}
                label={'Name'}
                name={`dataPerfType[${perfFormTypeIdx}].dataCategory[${perfFormCategoryIdx}].perfCategory`}
                formik={formik}
                apiFetcher={getPerfCategoryNameList}
                apiSearchKeys={['name']}
                apiTextKey={'name'}
                apiValueKey={'id'}
                initialOptions={
                  isModalEdit
                    ? initialOptionPerfCategory(
                        perfFormTypeIdx,
                        perfFormCategoryIdx,
                      )
                    : []
                }
              />
            </Grid.Column>
            {formik.values?.dataPerfType?.[perfFormTypeIdx]
              ?.isCategoryWeightCalc && (
              <Grid.Column>
                <Input
                  placeholder={'Insert Category Weight'}
                  label={'Weight'}
                  formik={formik}
                  type={'number'}
                  name={`dataPerfType[${perfFormTypeIdx}].dataCategory[${perfFormCategoryIdx}].categoryWeight`}
                  labelProps={{ basic: true, content: '%' }}
                  isNumber={true}
                  min={1}
                  max={100}
                />
              </Grid.Column>
            )}
          </Grid.Row>
        )}
        {/* KRA, KPI, & Target Button Toggle */}
        <Grid.Row className={!showItem ? 'display-none' : ''}>
          <Grid.Column>
            <Button
              color="blue"
              fluid
              inverted={activeIndex !== 0}
              onClick={() => handleChangeTab(0)}
              circular
              disabled={isKRAButtonActive === false}
            >
              KRA
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              color="blue"
              fluid
              inverted={activeIndex != 1}
              onClick={() => handleChangeTab(1)}
              circular
            >
              KPI
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              color="blue"
              fluid
              inverted={activeIndex != 2}
              onClick={() => handleChangeTab(2)}
              circular
              disabled={isTargetButtonActive === false}
            >
              Target
            </Button>
          </Grid.Column>
        </Grid.Row>
        {/* SECTION CATEGORI AND NON */}
        <Grid.Row
          className={
            activeIndex === 0 && isKRAButtonActive == true && showItem
              ? ''
              : 'display-none'
          }
        >
          <Grid.Column>
            <KRASectionPerfForm
              isModalEdit={isModalEdit}
              formik={formik}
              dataPerfTypeItemIdx={perfFormTypeIdx}
              dataCategoryIdx={perfFormCategoryIdx}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          className={activeIndex === 1 && showItem ? '' : 'display-none'}
        >
          <Grid.Column>
            <KPISectionPerfForm
              isModalEdit={isModalEdit}
              formik={formik}
              dataPerfTypeItemIdx={perfFormTypeIdx}
              dataCategoryIdx={perfFormCategoryIdx}
              isCategoryButtonActive={isCategoryButtonActive}
              isKRAButton={isKRAButtonActive}
            />
          </Grid.Column>
        </Grid.Row>
        {/* Target Section */}
        <Grid.Row
          className={
            activeIndex == 2 && isTargetButtonActive == true && showItem
              ? ''
              : 'display-none'
          }
        >
          <Grid.Column>
            <TargetSectionPerfForm
              isModalEdit={isModalEdit}
              isCategoryButtonActive={isCategoryButtonActive}
              formik={formik}
              dataPerfTypeItemIdx={perfFormTypeIdx}
              dataCategoryIdx={perfFormCategoryIdx}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}
