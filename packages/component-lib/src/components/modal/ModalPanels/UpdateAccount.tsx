import {  WithTranslation } from "react-i18next"
import { UpdateAccountBase, IconType, PanelProps } from "./BasicPanel"
import { Box, Typography } from '@mui/material';
import { AnimationArrow, Button } from '../../../index';
import { AccountBasePanel,AccountBaseProps, } from './index';
import { DepositRecorder } from './DepositRecorder';
import { AccountHashInfo } from '@loopring-web/common-resources';

export const UpdateAccount = ({
    t,
    goUpdateAccount,
    ...props
}: WithTranslation & AccountBaseProps & {
    goUpdateAccount?: () => void ,
    clearDepositHash: () => void ,
    chainInfos:AccountHashInfo}) => {
    return <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}
        alignItems={'center'}>
        <Box display={'flex'} flex={1} marginBottom={5} justifyContent={'center'} alignItems={'center'}>
            <AccountBasePanel {...props} t={t} />
        </Box>
        <Box display={'flex'} marginTop={2} alignSelf={'stretch'} paddingX={5} flexDirection={'column'} alignItems={'center'}>
            <Typography variant={'body2'} >
                {t('labelActivatedAccountDeposit')}
            </Typography>
            <AnimationArrow className={'arrowCta'} />
            <Button variant={'contained'} fullWidth size={'medium'} onClick={() => {
                if (goUpdateAccount) {
                    goUpdateAccount()
                }
            }}>{t('labelActivateAccount')} </Button>
        </Box>
        <Box display={'flex'} marginX={0}  marginTop={3} marginBottom={-5} alignSelf={'stretch'} paddingX={5} padding={0} >
            <DepositRecorder  {...props} clear={props.clearDepositHash} t={t}/>
        </Box>

    </Box>
}

// symbol
export const UpdateAccount_Approve_WaitForAuth = (props: PanelProps & WithTranslation) => {
    const propsPatch = {
        iconType: IconType.LoadingIcon,
        describe1: props.t('labelWaitForAuth')
    }
    return <UpdateAccountBase {...props} {...propsPatch} />
}

export const UpdateAccount_First_Method_Denied = (props: PanelProps & WithTranslation) => {
    const propsPatch = {
        iconType: IconType.RefuseIcon,
        describe1: props.t('labelFirstSignDenied'),
    }
    return <UpdateAccountBase {...propsPatch} {...props} />
}

export const UpdateAccount_User_Denied = (props: PanelProps & WithTranslation) => {
    const propsPatch = {
        iconType: IconType.RefuseIcon,
        describe1: props.t('labelSignDenied'),
    }
    return <UpdateAccountBase {...propsPatch} {...props} />
}

// symbol
export const UpdateAccount_Success = (props: PanelProps & WithTranslation) => {
    const describe1 = props.t(props.patch?.isReset ? 'labelResetAccountSuccess' : 'labelUpdateAccountSuccess')
    const describe2 = props.t(props.patch?.isReset ? 'labelResetAccountSuccess2' : 'labelUpdateAccountSuccess2')
    const propsPatch = {
        iconType: IconType.DoneIcon,
        describe1,
        describe2,
    }
    return <UpdateAccountBase {...propsPatch} {...props} />
}

// value symbol
export const UpdateAccount_Submit = (props: PanelProps & WithTranslation) => {
    const propsPatch = {
        iconType: IconType.SubmitIcon,
        describe1: props.t('labelUpdateAccountSubmit')
    }
    return <UpdateAccountBase {...propsPatch} {...props} />
}

// value symbol
export const UpdateAccount_Failed = (props: PanelProps & WithTranslation) => {
    const propsPatch = {
        iconType: IconType.FailedIcon,
        describe1:props.t('labelUpdateAccountFailed')
    }
    return <UpdateAccountBase {...propsPatch} {...props} />
}
