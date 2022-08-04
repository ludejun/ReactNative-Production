import React, { useEffect } from 'react';
import { View, Text, Modal } from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { Dispatch, RootState } from '../../store';

interface ToastGlobalComponentProps {
  toastMsg?: string
  toastVisible?: boolean
  hideToastGlobal: () => void
}

const ToastGlobalComponent: React.FC<ToastGlobalComponentProps> = (
  props: ToastGlobalComponentProps,
) => {
  const { toastMsg, toastVisible, hideToastGlobal } = props;
  useEffect(() => {
    if (toastVisible) setTimeout(() => hideToastGlobal(), 2000);
  }, [toastVisible]);
  return (
    <Modal visible={toastVisible} animationType={'fade'} transparent>
      <View flex center>
        <View width={244} center>
          <View br10 bg-grey33 paddingV-6 paddingH-10>
            <Text artTitle white t14>
              {toastMsg || ''}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const toastGlobalMapStateToProps = ({
  global: {
    toastGlobal: { toastMsg, toastVisible },
  },
}: RootState) => ({
  toastMsg,
  toastVisible,
});

const toastGlobalMapDispatchToProps: any = ({ global: { hideToastGlobal } }: Dispatch) => ({
  hideToastGlobal,
});

export const ToastGlobal = connect(
  toastGlobalMapStateToProps,
  toastGlobalMapDispatchToProps,
)(ToastGlobalComponent);
