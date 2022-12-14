import { Backdrop, Modal } from '@material-ui/core'
import React from 'react'
import { useDispatch } from 'react-redux'
import useStyles from './styles'
function BaseModal({body, isShow}) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const handleCloseModal = React.useCallback(() => {
        // dispatch(hideModal())
        // dispatch(removeUserState())
    },[dispatch])

    return (
        <div className={classes.modal}>
            <Modal 
                open={isShow} 
                className={classes.modal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
                >
                {body}
            </Modal>
        </div>
    )
}

export default BaseModal
