import { useCallback, useEffect, useState } from 'react'
import { Box, Grid } from '@material-ui/core'
import styled from '@emotion/styled'
import { TFunction, withTranslation, WithTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
// import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { Button } from '../../basic-lib'
import { Column,Table } from '../../basic-lib/tables'
import { TablePagination } from '../../basic-lib'
import { Filter } from './components/Filter'
import { TableFilterStyled, TablePaddingX } from '../../styled'
import { TableType } from '@loopring-web/common-resources';
import { useSettings } from '../../../stores'

const TableStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;

  .rdg {
    flex: 1;
    --template-columns: auto auto auto auto ${(props: any) => props.lan === 'zh_CN' ? '320px' : '370px'} !important;

    .rdg-cell.action {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  ${({theme}) => TablePaddingX({pLeft: theme.unit * 3, pRight: theme.unit * 3})}
` as any

interface Row {
    token: {
        type: TokenType;
        value: string;
    };
    amount: string;
    available: string;
    locked: string;
    filterColumn?: string
    tradePairList?: {
        first: string;
        last: string;
    }[]
    cellExpend?: {
        value: string
        children: []
        isExpanded: boolean
    }
    children?: Row[]
    isExpanded?: boolean
    format?: any
}

export enum TokenType {
    single = 'single',
    lp = 'lp'
}

export type TradePairItem = {
    first: string;
    last: string;
}

export enum LpTokenAction {
    add = 'add',
    remove = 'remove'
}

export type RawDataAssetsItem = {
    token: {
        type: TokenType,
        value: string
    }
    amount: string;
    available: string;
    locked: string;
    tradePairList?: TradePairItem[];
    smallBalance: boolean;
}

export interface AssetsTableProps {
    rawData: RawDataAssetsItem[];
    pagination?: {
        pageSize: number
    }
    onVisibleRowsChange?: (props: any) => void
    showFiliter?: boolean
    onShowDeposit: (token: string) => void,
    onShowTransfer: (token: string) => void,
    onShowWithdraw: (token: string) => void,
    onLpDeposit: (token: string, type: LpTokenAction ) => void,
    onLpWithdraw: (token: string, type: LpTokenAction) => void,
}

export const AssetsTable = withTranslation('tables')((props: WithTranslation & AssetsTableProps) => {
    const {
        t,
        pagination,
        rawData,
        onVisibleRowsChange,
        showFiliter,
        onShowDeposit,
        onShowTransfer,
        onShowWithdraw,
        onLpDeposit,
        // onLpWithdraw,
    } = props
    // const formattedRawData = rawData && Array.isArray(rawData) ? rawData.map(o => Object.values(o)) : []
    // const formattedRawData = rawData && Array.isArray(rawData) ? rawData : []
    // const [filterTokenType, setFilterTokenType] = useState('All Tokens')
    const [hideSmallBalance, setHideSmallBalance] = useState(false)
    const [hideLPToken, setHideLPToken] = useState(false)
    const [totalData, setTotalData] = useState<RawDataAssetsItem[]>([])
    const [page, setPage] = useState(1)
    const pageSize = pagination ? pagination.pageSize : 10;

    const {language} = useSettings()
    let history = useHistory()

    useEffect(() => {
        // setTotalData(rawData && Array.isArray(rawData) ? rawData.map(o => Object.values(o)) : [])
        setTotalData(rawData && Array.isArray(rawData) ? rawData : [])
    }, [rawData])

    const jumpToTrade = (pair: string) => {
        history.push({
            pathname: `/trading/lite/${pair}`
        })
    }

    const getColumnModeAssets = (t: TFunction): Column<Row, unknown>[] => [
        {
            key: 'token',
            name: t('labelToken'),
            formatter: ({row, column}) => {
                const token = row[ column.key ]
                const StyledToken = styled(Box)`
                  font-size: 13px;
                `
                return <StyledToken>{token.value}</StyledToken>
            }
        },
        {
            key: 'amount',
            name: t('labelAmount'),
            // minWidth: 120,
        },
        {
            key: 'available',
            name: t('labelAvailable'),
        },
        {
            key: 'locked',
            name: t('labelLocked'),
            // minWidth: 120,
        },
        {
            key: 'actions',
            name: t('labelActions'),
            // minWidth: 280,
            formatter: ({row}) => {
                const token = row[ 'token' ]
                const isLp = token.type === TokenType.lp
                const lpPairList = token.value.split('-')
                lpPairList.splice(0, 1)
                const lpPair = lpPairList.join('-')
                const tokenValue = token.value

                return (
                    <Grid container spacing={1} alignItems={'center'}>
                        <>
                            <Grid item>
                                <Button variant={'outlined'} size={'medium'} color={'primary'}
                                        onClick={() => onShowDeposit(tokenValue)}>{t('labelDeposit')}</Button>
                            </Grid>
                            <Grid item>
                                <Button variant={'outlined'} size={'medium'} color={'primary'}
                                        onClick={() => onShowTransfer(tokenValue)}>{t('labelTransfer')}</Button>
                            </Grid>
                            <Grid item>
                                <Button variant={'outlined'} size={'medium'} color={'primary'}
                                        onClick={() => onShowWithdraw(tokenValue)}>{t('labelWithdraw')}</Button>
                            </Grid>
                            {isLp ? (
                                <Grid item>
                                    <Button variant={'outlined'} size={'medium'} color={'primary'}
                                            onClick={() => onLpDeposit(lpPair, LpTokenAction.add)}>{t('labelAMM')}</Button>
                                </Grid>
                            ) : (
                                <Grid item>
                                    <Button variant={'outlined'} size={'medium'} color={'primary'}
                                            onClick={() => jumpToTrade(tokenValue)}>{t('labelTrade')}</Button>
                                </Grid>
                            )}
                        </>
                        {/* <Grid item>
                            {isLp
                                ? <Button variant={'outlined'} color={'primary'} disabled>{t('labelAMM')} </Button>
                                : <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                        <>
                                            <Button variant={'outlined'} size={'medium'}
                                                    color="primary" {...bindTrigger(popupState)}>
                                                Trade
                                            </Button>
                                            <Menu {...bindMenu(popupState)}>
                                                {tradePairs.map(({first, last}) => {
                                                    const value = `${first}/${last}`;
                                                    return (
                                                        <MenuItem onClick={popupState.close} key={value}
                                                                value={value}>{value}</MenuItem>
                                                    )
                                                })}
                                            </Menu>
                                        </>
                                    )}
                                </PopupState>
                            }
                        </Grid> */}
                    </Grid>
                )
            }
        },
        {
            key: 'tradePairList',
            name: 'tradePairList',
            hidden: true
        }
    ]

    const defaultArgs: any = {
        // rawData: [],
        columnMode: getColumnModeAssets(t).filter(o => !o.hidden),
        generateRows: (rawData: any) => rawData,
        generateColumns: ({columnsRaw}: any) => columnsRaw as Column<any, unknown>[],
    }

    const getRenderData = useCallback(() => pagination
        ? totalData.slice((page - 1) * pageSize, page * pageSize)
        : totalData
        , [page, pageSize, pagination, totalData])

    const updateData = useCallback(({
                                        TableType,
                                        // currFilterTokenType = filterTokenType,
                                        currHideSmallBalance = hideSmallBalance,
                                        currHideLPToken = hideLPToken
                                    }) => {
        // let resultData = rawData && Array.isArray(rawData) ? rawData.map(o => Object.values(o)) : []
        let resultData = (rawData && !!rawData.length) ? rawData : []
        // if (currFilterTokenType !== 'All Tokens') {
        //     resultData = resultData.filter(o =>
        //         (o[ 0 ] as TokenTypeCol).value === currFilterTokenType
        //     )
        // }
        if (currHideSmallBalance) {
            resultData = resultData.filter(o => !o.smallBalance)
        }
        if (currHideLPToken) {
            resultData = resultData.filter(o => o.token.type === TokenType.single)
        }
        if (TableType === 'filter') {
            setPage(1)
        }
        setTotalData(resultData)
    }, [rawData, /* filterTokenType,  */hideSmallBalance, hideLPToken])

    const handleFilterChange = useCallback(({/* tokenType,  */currHideSmallBalance, currHideLPToken}) => {
        // setFilterTokenType(tokenType)
        setHideSmallBalance(currHideSmallBalance)
        setHideLPToken(currHideLPToken)
        updateData({TableType: TableType.filter, /* currFilterTokenType: tokenType, */ currHideSmallBalance, currHideLPToken})
    }, [updateData])

    const handlePageChange = useCallback((page: number) => {
        setPage(page)
        updateData({TableType: TableType.page})
    }, [updateData])

    const getScrollIndex = useCallback((e) => {
        const startIndex = parseInt(String(e.target.scrollTop / 44))
        const viewportRows = rawData && Array.isArray(rawData) ? rawData.slice(startIndex, startIndex + 10).map(o => o.token.value) : []
        if (onVisibleRowsChange) {
            onVisibleRowsChange(viewportRows)
        }
    }, [onVisibleRowsChange, rawData])

    return <TableStyled lan={language}>
        {showFiliter && (
            <TableFilterStyled>
                <Filter originalData={rawData} handleFilterChange={handleFilterChange}/>
            </TableFilterStyled>
        )}
        <Table {...{...defaultArgs, ...props, rawData: getRenderData()}} onScroll={getScrollIndex}/>
        {pagination && (
            <TablePagination page={page} pageSize={pageSize} total={totalData.length} onPageChange={handlePageChange}/>
        )}
    </TableStyled>
})
