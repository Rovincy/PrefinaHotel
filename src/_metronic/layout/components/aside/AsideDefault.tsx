/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useLayout } from '../../core';
import { KTSVG, toAbsoluteUrl } from '../../../helpers';
import { AsideMenu } from './AsideMenu';

const AsideDefault: FC = () => {
  const { config, classes } = useLayout();
  const asideRef = useRef<HTMLDivElement | null>(null);
  const { aside } = config;

  const minimize = () => {
    asideRef.current?.classList.add('animating');
    setTimeout(() => {
      asideRef.current?.classList.remove('animating');
    }, 300);
  };

  return (
    <div
      id='kt_aside'
      className={clsx('aside', classes.aside.join(' '))}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
      ref={asideRef}
      style={{
        backgroundColor: '#000', // Black background
        color: '#D4AF37', // Gold text
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Soft shadow for depth
      }}
    >
      {/* begin::Brand */}
      <div className='aside-logo flex-column-auto' id='kt_aside_logo'>
        {/* Button-like text for APEX SUITES */}
        <div
          className='btn text-white w-100 text-center mb-2 transition-colors'
          style={{
            backgroundColor: '#333', // Dark background for button
            border: '1px solid #D4AF37', // Gold border
            borderRadius: '5px', // Rounded corners
            padding: '10px 0', // Vertical padding
            transition: 'background-color 0.3s, color 0.3s', // Smooth transition for background and text color
          }}
        >
          <span className='hover:text-black transition-colors' style={{ color: 'inherit' }}>
            ---- APEX SUITES ----
          </span>
        </div>

        {/* begin::Aside toggler */}
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
            onClick={minimize}
            style={{
              color: '#D4AF37', // Gold color for toggler
            }}
          >
            <KTSVG
              path={'/media/icons/duotune/arrows/arr080.svg'}
              className={'svg-icon-1 rotate-180'}
            />
          </div>
        )}
        {/* end::Aside toggler */}
      </div>
      {/* end::Brand */}

      {/* begin::Aside menu */}
      <div className='aside-menu flex-column-fluid' style={{ background: 'linear-gradient(to bottom, #1a1a1a, #B8860B)' }}>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
    </div>
  );
};

export { AsideDefault };
