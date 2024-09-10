import { FormikProps } from 'formik';
import { useRef } from 'react';

/**
 * hooks to prevent useFormik re-initiate every render
 * usually used to update formik value's state inside useEffect
 *
 * Source :
 * https://github.com/jaredpalmer/formik/issues/2858
 * https://stackoverflow.com/questions/57533470/react-hook-useeffect-while-adding-a-missing-dependency-goes-into-endless-loop
 * @param useFormik
 * @returns immutableFormik
 */
function useImmutableFormik(useFormik: FormikProps<any>) {
  const { current: immutableFormik } = useRef(useFormik);
  return immutableFormik;
}

export default useImmutableFormik;
