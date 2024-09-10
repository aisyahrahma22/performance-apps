import axios from '../../axios';
import useSWR, { SWRConfiguration } from 'swr';
import { useCallback, useState } from 'react';

const API_SYSTEM_CONFIGURATION = '/api/system-configuration';

const getSystemConfiguration = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

export enum SystemConfigurationCodeEnum {
  IDP_REMINDER_SCHEDULE = 'IDP_REMINDER_SCHEDULE',
  SUCCESS_PROFILE_REMINDER_SCHEDULE = 'SUCCESS_PROFILE_REMINDER_SCHEDULE',
  IDP_ITEM_MIN_STRENGTH = 'IDP_ITEM_MIN_STRENGTH',
  IDP_ITEM_MAX_STRENGTH = 'IDP_ITEM_MAX_STRENGTH',
  IDP_ITEM_MIN_AREA_TO_FOCUS = 'IDP_ITEM_MIN_AREA_TO_FOCUS',
  IDP_ITEM_MAX_AREA_TO_FOCUS = 'IDP_ITEM_MAX_AREA_TO_FOCUS',
  FSP_GROUP_BY_FUNCTION = 'FSP_GROUP_BY_FUNCTION',
  MAIL_HOST = 'MAIL_HOST',
  MAIL_HTTPS = 'MAIL_HTTPS',
  MAIL_PORT = 'MAIL_PORT',
  MAIL_TLS = 'MAIL_TLS',
  MAIL_AUTH_USER = 'MAIL_AUTH_USER',
  MAIL_AUTH_PASS = 'MAIL_AUTH_PASS',
  MAIL_DEFAULT_FROM_NAME = 'MAIL_DEFAULT_FROM_NAME',
  MAIL_DEFAULT_FROM_MAIL = 'MAIL_DEFAULT_FROM_MAIL',
  POSITION_GROUP_TYPE_BY_FUNCTION = 'POSITION_GROUP_TYPE_BY_FUNCTION',
  POSITION_GROUP_TYPE_BY_C_LEVEL = 'POSITION_GROUP_TYPE_BY_C_LEVEL',
  LOCKED_MAX_ATTEMPTS = 'LOCKED_MAX_ATTEMPTS',
  SKILL_ATTRIBUTES = 'SKILL_ATTRIBUTES',
  SKILL_CAPABILITIES = 'SKILL_CAPABILITIES',
  LEARNING_EXECUTIVE_NAME = 'LEARNING_EXECUTIVE_NAME',
  LEARNING_EXECUTIVE_POSITION = 'LEARNING_EXECUTIVE_POSITION',
  LEARNING_EXECUTIVE_SIGNATURE = 'LEARNING_EXECUTIVE_SIGNATURE',
  OUTSTANDING_FORM_PUBLISH_PROCESS = 'OUTSTANDING_FORM_PUBLISH_PROCESS',
  SYNC_PERF_WORKFLOW_PROCESS = 'SYNC_PERF_WORKFLOW_PROCESS',
  LEARNING_CALENDER_REMINDER = 'LEARNING_CALENDER_REMINDER',
  LEARNING_REALIZATION_REMINDER = 'LEARNING_REALIZATION_REMINDER',
  LEARNING_EVAL_PARTICIPANT_REMINDER = 'LEARNING_EVAL_PARTICIPANT_REMINDER',
  CONFIG_FOR_VISIBILITY_MID_YEAR_SECTION = 'CONFIG_FOR_VISIBILITY_MID_YEAR_SECTION',
  CONFIG_FOR_DEFAULT_FILTER_PERFOMANCE = 'CONFIG_FOR_DEFAULT_FILTER_PERFOMANCE',
  SESSION_TIMEOUT_WARNING_CONFIG = 'SESSION_TIMEOUT_WARNING_CONFIG',
  POSITION_GROUP_TYPE_BY_IDP = 'POSITION_GROUP_TYPE_BY_IDP',
}

export const useSystemConfiguration = (
  id: SystemConfigurationCodeEnum,
  option?: Partial<SWRConfiguration>,
) => {
  const [counter, setCounter] = useState(0);

  const { data, error, mutate } = useSWR(
    id ? [API_SYSTEM_CONFIGURATION, id, counter] : null,
    getSystemConfiguration,
    option,
  );

  const update = useCallback(
    (newData) => {
      mutate(newData, false);
    },
    [mutate],
  );

  const forceMutate = useCallback(() => {
    setCounter(counter + 1);
  }, [counter, setCounter]);

  return {
    systemConfiguration: data,
    systemConfigurationMutate: update,
    systemConfigurationForceMutate: forceMutate,
    isSystemConfigurationLoading: !error && !data,
    isSystemConfigurationError: error,
  };
};

export default useSystemConfiguration;
