import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import { ColorStatusEnum } from '../enum/LabelStatusEnum';
import { TypographySizeEnum, TypographyTypeEnum } from '../enum/TypographyEnum';

type TypographyProps = {
  type: TypographyTypeEnum;
  size?: TypographySizeEnum | any;
};

const Typography = ({ type, size }: TypographyProps) => {
  switch (type as any) {
    case 'Approved':
      return (
        <Label size={size} className={ColorStatusEnum.Approved}>
          <Icon name="mail" /> {type}
        </Label>
      );

    case 'Requested':
      return (
        <Label size={size} className={ColorStatusEnum.Requested}>
          <Icon name="mail" /> {type}
        </Label>
      );

    case 'Draft':
      return (
        <Label size={size} className={ColorStatusEnum.Draft}>
          <Icon name="mail" /> {type}
        </Label>
      );

    case 'In Progress':
      return (
        <Label size={size} className={ColorStatusEnum.InProgress}>
          <Icon name="mail" /> {type}
        </Label>
      );

    case 'Rejected':
      return (
        <Label size={size} className={ColorStatusEnum.Rejected}>
          <Icon name="mail" /> {type}
        </Label>
      );

    case 'Verified':
      return (
        <Label size={size} className={ColorStatusEnum.Verified}>
          <Icon name="mail" /> {type}
        </Label>
      );

    default:
      return (
        <Label size={size} className={ColorStatusEnum.Requested}>
          <Icon name="mail" /> {type}
        </Label>
      );
  }
};

export default Typography;
