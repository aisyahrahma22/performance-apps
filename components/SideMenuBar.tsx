import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Accordion,
  Dimmer,
  Header,
  Icon,
  Loader,
  Menu,
  Segment,
  Popup,
  Placeholder,
} from 'semantic-ui-react';
import { concat, intersection, isEmpty, reduce } from 'lodash';

import MAIN_MENU from '../helper/menus';
import { authStateSelector, currentActionsSelector } from '../lib/slice/auth';
import pjson from '../package.json';
import produceLooping from '../lib/util/produceLooping';

const SideMenuBar = () => {
  const router = useRouter();
  const authState = useSelector(authStateSelector);
  const loadingAuth = authState.isFetchingUserActions || authState.isFetchingUserRole;
  const currentActions = useSelector(currentActionsSelector);
  const showPlaceholder = useMemo(() => loadingAuth && !currentActions?.length, [loadingAuth, currentActions]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hideSidebar, setHideSidebar] = useState(false);

  const menuPress = useCallback((link, hasParent) => (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasParent) setActiveAccordion(null);
    router.push(link);
  }, [router]);

  const accordionPress = useCallback((code) => () => {
    setActiveAccordion((prev) => (prev === code ? null : code));
  }, []);

  const renderMenu = useCallback((isParentActive, hasParent) => (menu: any) => {
    const { code, name, submenu, icon, pathname, availableActions, iconActive } = menu;

    const submenuPaths = submenu?.map((s: any) => s.pathname) || [];
    const isActive = router.pathname === pathname || submenuPaths.includes(router.pathname);
    const isAccordionActive = activeAccordion === code;

    const MenuIcon = (
      <img
        alt={`icon-${name}`}
        src={isActive ? iconActive : icon}
        style={{ marginRight: '1em', width: '25px', height: '25px' }}
      />
    );

    const MenuItem = (
      <span
        className={`rvtexts ${isActive ? 'semibold' : 'regular'} text-xs rvcolors ${
          isActive ? '#dad9f4' : 'color-gray-400'
        }`}
      >
        {name}
      </span>
    );

    if (!submenu || submenu.length === 0) {
      return (
        <Menu.Item
          as="a"
          key={code}
          href={pathname}
          active={isActive}
          onClick={menuPress(pathname, hasParent)}
          style={{ paddingLeft: hasParent ? '3em' : undefined, display: 'flex' }}
          className={!hasParent ? 'no-child rvaccordions' : 'rvaccordions'}
        >
          {!hideSidebar && !hasParent ? MenuIcon : null}
          {hideSidebar && !hasParent ? (
            <Popup trigger={MenuIcon} content={name} position="right center" offset={[0, 20]} />
          ) : (
            MenuItem
          )}
        </Menu.Item>
      );
    } else {
      return (
        <Menu.Item key={code} active={isActive} onClick={accordionPress(code)} className="rvaccordions">
          {!hideSidebar ? (
            <Accordion.Title
              key={`${code}-acc-title`}
              active={isActive || isAccordionActive}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              className="rvaccordions"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {MenuIcon}
                <span className="rvtexts semibold text-xs rvcolors color-gray-600">{name}</span>
              </div>
              <Icon style={{ margin: '0 .25rem 0 0' }} name="dropdown" className="rvcolors blue" />
            </Accordion.Title>
          ) : (
            <Popup
              trigger={
                <Accordion.Title
                  key={`${code}-acc-title`}
                  active={isActive || isAccordionActive}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Popup trigger={MenuIcon} position="right center" content={name} offset={[0, 20]} />
                  <Icon style={{ margin: '0 .25rem 0 0' }} name="caret right" />
                </Accordion.Title>
              }
              position="right center"
              on="click"
              className="sidemenubarpop"
              content={
                <div>
                  <div style={{ borderBottom: '2px solid black', fontWeight: 'bolder', marginBottom: '10px', paddingBottom: '5px' }}>
                    {name}
                  </div>
                  <Menu.Menu>{submenu.map(renderMenu(isActive, true))}</Menu.Menu>
                </div>
              }
              offset={isActive ? [0, -5] : [0, 10]}
            />
          )}
          {!hideSidebar && (
            <Accordion.Content
              key={`${code}-acc-content`}
              active={isActive || isAccordionActive}
              content={<Menu.Menu>{submenu.map(renderMenu(isActive, true))}</Menu.Menu>}
            />
          )}
        </Menu.Item>
      );
    }
  }, [currentActions, router.pathname, activeAccordion, menuPress, accordionPress, hideSidebar]);

  return (
    <Accordion
      as={Menu}
      borderless
      inverted
      vertical
      size="huge"
      className={`sidemenubar${hideSidebar ? ' collapse' : ''}`}
      style={{
        backgroundColor: '#FCFCFD',
        paddingBottom: hideSidebar ? '2em' : '1em',
        minWidth: hideSidebar ? '75px' : undefined,
        width: hideSidebar ? '75px' : undefined,
        borderRight: '0.5px solid #D0D5DD',
      }}
    >
      <Dimmer active={authState.isFetchingUserActions}>
        <Loader />
      </Dimmer>
      <Menu.Item
        as={Segment}
        textAlign="center"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-20px' }}
        className="header"
      >
        {!hideSidebar ? (
          <Header
            as="h2"
            icon
            inverted
            size="huge"
            style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '5px' }}
          >
            <img alt="logo" src="/images/myApps.jpeg" style={{ width: '50%' }} />
          </Header>
        ) : null}
        <img
          alt="ic-burger"
          src="/icons-revamp/burger.svg"
          style={{ width: '30px', height: '30px', cursor: 'pointer', marginTop: '1em' }}
          onClick={() => setHideSidebar(!hideSidebar)}
        />
      </Menu.Item>
      {showPlaceholder
        ? produceLooping(5, (
          <Menu.Item as="a" style={{ display: 'flex', padding: '0.8rem' }}>
            <Placeholder style={{ marginRight: '1em', width: '100%', height: '2rem', borderRadius: '1rem' }}>
              <Placeholder.Image />
            </Placeholder>
          </Menu.Item>
        ))
        : MAIN_MENU.map(renderMenu(false, false))}
      {!hideSidebar ? (
        <div>
          <p
            style={{
              marginTop: '7em',
              paddingLeft: hideSidebar ? 0 : '1.5em',
              fontSize: '12px',
            }}
            className="rvcolors color-gray-700 rvtexts regular text-xs"
          >
            <span>
              v1.1.1 2024
            </span>
            <p style={{ textAlign: hideSidebar ? 'center' : 'left' }}>© 2024 - my Apps Hospitals</p>
          </p>
        </div>
      ) : null}
    </Accordion>
  );
};

export default SideMenuBar;
