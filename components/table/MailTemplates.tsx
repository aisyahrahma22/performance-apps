import { Button, Icon, Segment, Table } from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import useMailTemplates from '../../lib/data/mail/useMailTemplates';
import ModalMailTemplateDetail from '../modal/MailTemplateDetail';
import ModalMailTemplateEdit from '../modal/MailTemplateEdit';
import TableHeaderCell from '../TableHeaderCell';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import ModalMailSystemConfigurationEdit from '../modal/MailSystemConfigurationEdit';
import TablePaginationNew from '../TablePaginationNew';

const TableMailTemplates = () => {
  const {
    mailTemplates,
    isMailTemplatesLoading,
    mailTemplatesRefreshPress,
    isMailTemplatesEmpty,
    isMailTemplatesError,
    mailTemplatesTotalCount,
    mailTemplatesPage,
    mailTemplatesPagePress,
    mailTemplatesTotalPage,
    mailTemplatesSort,
    mailTemplatesSortPress,
    mailTemplatesNextFivePagePress,
    mailTemplatesPrevFivePagePress,
    mailTemplatesFirstPagePress,
    mailTemplatesLastPagePress,
  } = useMailTemplates();

  const [isModalMailTemplateDetail, setIsModalMailTemplateDetail] =
    useState(false);
  const [isModalMailTemplateEdit, setIsModalMailTemplateEdit] = useState(false);
  const [modalMailTemplateDetailData, setModalMailTemplateDetailData] =
    useState<any>(null);
  const [modalMailTemplateEditData, setModalMailTemplateEditData] =
    useState<any>(null);
  const [isModalMailTemplatesConfig, setIsModalMailTemplatesConfig] =
    useState(false);

  // Modal Detail
  const modalMailTemplateDetailOpenPress = useCallback(
    (mailTemplate) => () => {
      setModalMailTemplateDetailData(mailTemplate.id);
      setIsModalMailTemplateDetail(true);
    },
    [],
  );

  const modalMailTemplateDetailClosePress = useCallback(() => {
    setIsModalMailTemplateDetail(false);
  }, []);

  // Modal Edit
  const modalMailTemplateEditOpenPress = useCallback(
    (mailTemplate) => () => {
      setModalMailTemplateEditData(mailTemplate.id);
      setIsModalMailTemplateEdit(true);
    },
    [],
  );

  const modalMailTemplateEditClosePress = useCallback(() => {
    mailTemplatesRefreshPress();
    setIsModalMailTemplateEdit(false);
  }, [mailTemplatesRefreshPress]);

  // Modal Config
  const modalMailTemplatesConfigOpenPress = useCallback(() => {
    setIsModalMailTemplatesConfig(true);
  }, []);

  const modalMailTemplatesConfigClosePress = useCallback(() => {
    mailTemplatesRefreshPress();
    setIsModalMailTemplatesConfig(false);
  }, [mailTemplatesRefreshPress]);

  return (
    <>
      <Segment raised className={'nopadding'}>
        <Segment clearing basic className={'nomargin'}>
          <Button
            size={'tiny'}
            floated="right"
            onClick={mailTemplatesRefreshPress as any}
            basic
            icon
          >
            <Icon name="refresh" />
          </Button>
          <RenderGuard actionKey={RightEnum.SYSTEM_CONFIGURATION_EDIT}>
            <Button
              size={'tiny'}
              floated="right"
              color={'teal'}
              icon
              onClick={modalMailTemplatesConfigOpenPress}
              labelPosition={'right'}
            >
              Mail Account Configuration
              <Icon name={'setting'} />
            </Button>
          </RenderGuard>
        </Segment>
        <div className={'horizontal-scroll'}>
          <Table
            selectable={!(isMailTemplatesLoading || isMailTemplatesEmpty)}
            className={'nomargin'}
            color={'teal'}
            singleLine
            compact
            fixed
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell
                  sortable
                  width={4}
                  attribute={'code'}
                  name={'Code'}
                  direction={mailTemplatesSort.code}
                  onSortPress={mailTemplatesSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={5}
                  attribute={'name'}
                  name={'Name'}
                  direction={mailTemplatesSort.name}
                  onSortPress={mailTemplatesSortPress}
                />
                <TableHeaderCell
                  sortable
                  width={5}
                  attribute={'description'}
                  name={'Description'}
                  direction={mailTemplatesSort.description}
                  onSortPress={mailTemplatesSortPress}
                />
                <Table.HeaderCell width={2} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isMailTemplatesLoading && (
                <TablePlaceholder rowCount={15} colCount={4} />
              )}
              {!isMailTemplatesLoading && isMailTemplatesEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={4}>
                    {isMailTemplatesError
                      ? isMailTemplatesError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isMailTemplatesLoading &&
                mailTemplates?.map((template: any) => (
                  <Table.Row key={template.id}>
                    <Table.Cell>{template.code}</Table.Cell>
                    <Table.Cell>{template.name}</Table.Cell>
                    <Table.Cell>{template.description}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <RenderGuard actionKey={RightEnum.EMAIL_TEMPLATE_VIEW}>
                          <Button
                            icon={'eye'}
                            onClick={modalMailTemplateDetailOpenPress(template)}
                          />
                        </RenderGuard>
                        <RenderGuard actionKey={RightEnum.EMAIL_TEMPLATE_EDIT}>
                          <Button
                            icon={'pencil'}
                            onClick={modalMailTemplateEditOpenPress(template)}
                          />
                        </RenderGuard>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <Segment clearing basic className={'nomargin'}>
          {!isMailTemplatesLoading && !isMailTemplatesEmpty && (
            <>
              Show <b>{mailTemplates?.length}</b> of{' '}
              <b>{mailTemplatesTotalCount}</b> entries
              {mailTemplatesTotalPage > 1 && (
                <TablePaginationNew
                  pagePress={mailTemplatesPagePress}
                  totalPage={mailTemplatesTotalPage}
                  activePage={mailTemplatesPage}
                  nextFivePagePress={mailTemplatesNextFivePagePress}
                  prevFivePagePress={mailTemplatesPrevFivePagePress}
                  firstPagePress={mailTemplatesFirstPagePress}
                  lastPagePress={mailTemplatesLastPagePress}
                />
              )}
            </>
          )}
        </Segment>
        {isModalMailTemplateDetail && (
          <ModalMailTemplateDetail
            id={modalMailTemplateDetailData}
            isOpen={isModalMailTemplateDetail}
            closePress={modalMailTemplateDetailClosePress}
          />
        )}
        {isModalMailTemplateEdit && (
          <ModalMailTemplateEdit
            id={modalMailTemplateEditData}
            isOpen={isModalMailTemplateEdit}
            closePress={modalMailTemplateEditClosePress}
          />
        )}
        {isModalMailTemplatesConfig && (
          <ModalMailSystemConfigurationEdit
            isOpen={isModalMailTemplatesConfig}
            closePress={modalMailTemplatesConfigClosePress}
          />
        )}
      </Segment>
    </>
  );
};

export default TableMailTemplates;
