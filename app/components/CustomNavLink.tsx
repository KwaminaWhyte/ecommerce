// import { Transition } from "@headlessui/react";
import { NavLink } from "@remix-run/react";
import React, { useState } from "react";

const CustomNavLink = ({
  link,
  collapseNav,
}: {
  link: string;
  collapseNav: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <NavLink
      key={link?.id}
      to={link?.path}
      className={({ isActive, isPending }) =>
        isPending
          ? "mb-1 flex flex-col items-center px-3 py-2  dark:text-slate-300"
          : isActive
          ? "mb-1 flex flex-col items-center rounded-xl bg-blue-100/60 px-3 py-2  font-bold dark:bg-slate-800 dark:text-white"
          : "mb-1 flex flex-col items-center px-3 py-2  dark:text-slate-300"
      }
      end
      onClick={handleToggleExpand}
    >
      <div className="flex items-center">
        {link?.icon}

        {/* <Transition show={!collapseNav}> */}
        <span className="ml-1">{link?.name}</span>
        {/* </Transition> */}
      </div>

      {link?.children && (
        // <Transition show={isExpanded}>
        <ul className="">
          {link?.children.map((childLink) => (
            <li key={childLink.id}>
              <NavLink
                to={"/console" + childLink.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center rounded-xl bg-blue-100/60 px-3 py-2  font-bold dark:bg-slate-800 dark:text-white"
                    : "flex items-center px-3 py-2  dark:text-slate-300"
                }
                end
              >
                {childLink.icon}
                {/* <Transition show={!collapseNav}> */}
                <span className="ml-1">{childLink.name}</span>
                {/* </Transition> */}
              </NavLink>
            </li>
          ))}
        </ul>
        // </Transition>
      )}
    </NavLink>
  );
};

export default CustomNavLink;
