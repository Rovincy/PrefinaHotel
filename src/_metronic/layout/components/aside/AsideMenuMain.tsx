/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'

export function AsideMenuMain() {
  const intl = useIntl()

  const {currentUser} = useAuth()
  // console.log('AsideMenuMain: ',currentUser)
  // console.log('AsideMenuMain Id: ',currentUser?.roleId)
  return (
    <>
      {/* <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      /> */}
      <AsideMenuItem
        to='/'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      {/* <AsideMenuItem 
        to='#' 
        // hasBullet={true} 
        icon='/media/icons/duotune/communication/com013.svg'
        title='Employees' 
      /> */}
      <AsideMenuItemWithSub
        to='#'
        icon='/media/svg/frontDesk.svg'
        title='Front Desk'
      >
        <AsideMenuItem
          to='frontOffice/walkIn/'
          hasBullet={false}
          icon='/media/svg/calendar.svg'
          title='Calendar'
        />
        <AsideMenuItem
          to='billing/*'
          // to='#'
          hasBullet={false}
          icon='/media/svg/billing.svg'
          title='Ledger'
        />
      </AsideMenuItemWithSub>
      
      {/* <AsideMenuItemWithSub to='#' icon='/media/icons/duotune/communication/com013.svg' title='GRM'> */}
        <AsideMenuItem
          to='grm/Guests/'
          hasBullet={false}
          icon='/media/svg/guest.svg'
          title='Guests'
        />
        {/* <AsideMenuItem
          to='grm/Notes/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen028.svg'
          title='Notes'
        />
      </AsideMenuItemWithSub> */}
      {/* )} */}
      

     {currentUser?.role?.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItem
        to='report-page/'
        icon='/media/svg/files/dark/doc.svg'
        title='Reports'
      ></AsideMenuItem>)}

      <AsideMenuItemWithSub
        to='#'
        icon='/media/icons/custom/settings.svg'
        title='Setup'
      >
        <AsideMenuItem
          to='paymentMethod/'
          hasBullet={false}
          icon='/media/svg/paymentMethods.svg'
          title='Payment Methods'
        />
        {currentUser?.role?.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItem
          to='currency/'
          hasBullet={false}
          icon='/media/svg/currency.svg'
          title='Currency'
        />)}
        
        {currentUser?.role?.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<>
        {/* <AsideMenuItem
          to='company/'
          hasBullet={false}
          icon='/media/svg/building.svg'
          title='Company'
        /> */}
        <AsideMenuItem
          to='tax/'
          hasBullet={false}
          icon='/media/svg/tax.svg'
          title='Tax'
        />
          <AsideMenuItem
            to='roomType/'
            hasBullet={false}
            icon='/media/svg/room.svg'
            title='Rooms'
          />
          <AsideMenuItem
            to='/services/category'
            hasBullet={false}
            icon='/media/svg/services.svg'
            title='Services'
          />
          {/* <AsideMenuItem
          to='hoursExtension/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Hours Extension'
        /> */}
          </>)}

        {/* <AsideMenuItem
          to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Source'
        /> */}
        {/* {currentUser?.role?.toLowerCase()==="Manager".toLocaleLowerCase()||currentUser?.role?.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<><AsideMenuItem
          to='/users'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Users' /><AsideMenuItem
            to='#'
            hasBullet={false}
            icon='/media/icons/duotune/general/gen005.svg'
            title='Roles' /></>)} */}
      </AsideMenuItemWithSub>
      
      {currentUser?.role?.toLowerCase()==="Manager".toLocaleLowerCase()||currentUser?.role?.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title='User Management'
      >

        <AsideMenuItem
          to='/users'
          hasBullet={false}
          icon='/media/svg/activeUser.svg'
          title='Users'
        />
        <AsideMenuItem
          to='/roles'
          hasBullet={false}
          icon='/media/svg/role.svg'
          title='Roles'
        />
      </AsideMenuItemWithSub>
)}
      {/* {currentUser?.role?.toLowerCase()==="Manager".toLocaleLowerCase()||currentUser?.role?.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title='Administration'
      >
        <AsideMenuItem
          to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Audit'
        />
      </AsideMenuItemWithSub>
)} */}
      
    </>
  )
}
