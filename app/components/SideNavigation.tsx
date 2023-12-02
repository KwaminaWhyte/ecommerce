import { useEffect, useState } from "react";
import { Form, Link, NavLink } from "@remix-run/react";
import { Transition } from "@headlessui/react";
import sideNavLinks from "./inc/side_nav_links";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/base";
import { Button } from "./ui/button";
import IdGenerator from "~/lib/IdGenerator";

export default function SideNavigation({ user }: { user: any }) {
  const [collapseNav, setCollapseNav] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    let active = localStorage.getItem("activeMenu");
    setActiveMenu(active);
  }, []);

  return (
    <aside
      className={`h-screen sticky top-0 z-40 mt-0 flex flex-col bg-white pt-6 first-line:top-0 dark:bg-black  ${
        collapseNav ? " w-20 " : " w-64 "
      }`}
    >
      <section className="relative mx-4 flex h-20 items-center justify-center dark:text-white">
        <Transition show={!collapseNav}>
          <h3 className="font-bold">Business</h3>
        </Transition>

        <div
          className="absolute -right-6 rounded-full border border-slate-400 bg-white dark:bg-black"
          onClick={() => {
            setCollapseNav(!collapseNav);
          }}
        >
          {collapseNav ? (
            <svg
              className="m-1 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              ></path>
            </svg>
          ) : (
            <svg
              className="m-1 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              ></path>
            </svg>
          )}
        </div>
      </section>

      <section className="mx-4 flex flex-col">
        {sideNavLinks.map((link) => (
          <>
            {link?.children?.length < 1 ? (
              <NavLink
                key={IdGenerator(8)}
                to={link.path}
                onClick={() => localStorage.setItem("activeMenu", link.name)}
                className={({ isActive, isPending }) =>
                  isPending
                    ? "mb-1 flex items-center px-3 py-2  dark:text-slate-300"
                    : isActive
                    ? "mb-1 flex items-center rounded-xl border-x-2 border-blue-500 bg-blue-100/60 px-3 py-2  font-bold dark:bg-slate-800 dark:text-white"
                    : "mb-1 flex items-center px-3 py-2 dark:text-slate-300 hover:bg-slate-200 rounded-xl"
                }
                end
              >
                {link.icon}

                <Transition show={!collapseNav}>
                  <span className="ml-1">{link.name}</span>
                </Transition>
              </NavLink>
            ) : (
              <p
                className="mb-1 flex items-center px-3 py-2 dark:text-slate-300 cursor-pointer hover:bg-slate-200 rounded-xl"
                onClick={() => {
                  localStorage.setItem("activeMenu", link.name);
                  setActiveMenu(link.name);
                }}
              >
                {link.icon}

                <Transition show={!collapseNav}>
                  <span className="ml-1">{link.name}</span>
                </Transition>
              </p>
            )}

            <Transition
              show={activeMenu === link.name}
              className="ml-6 border-l border-slate-400"
            >
              {link?.children?.map((child) => (
                <NavLink
                  key={IdGenerator(8)}
                  to={child.path}
                  className={({ isActive }) =>
                    isActive
                      ? "my-1 ml-3 flex items-center rounded-xl border-x-2 border-blue-500 bg-blue-100/60 px-3 py-2  font-bold dark:bg-slate-800 dark:text-white"
                      : "my-1 ml-3 flex items-center px-3 py-2  dark:text-slate-300"
                  }
                  end
                >
                  <Transition show={!collapseNav}>
                    <span className="ml-1">{child.name}</span>
                  </Transition>
                </NavLink>
              ))}
            </Transition>
          </>
        ))}
      </section>

      <section className="mx-4 mb-3 mt-auto flex items-center dark:text-white">
        <Dropdown>
          <MenuButton className="flex mt-2 border border-slate-200 w-full rounded-xl items-center p-1 dark:hover:bg-blue-800/50 hover:bg-slate-100">
            <img
              className="mr-3 h-9 w-9 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1506792006437-256b665541e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt=""
            />
            <Transition show={!collapseNav}>
              <div className="flex flex-col">
                <p className="m-0 p-0 text-left font-bold">{user.username}</p>
                <p className="mr-auto">Super Admin</p>
                {/* <p className="">{user.email}</p> */}
              </div>
            </Transition>
          </MenuButton>
          <Menu className="z-50 p-2 bg-white rounded-lg shadow-lg my-5 mx-3 border border-slate-300 w-52">
            <MenuItem className="p-2 flex list-none cursor-default hover:bg-slate-200 rounded-lg">
              <Link to="/console/profile" className="w-full">
                Profile
              </Link>
            </MenuItem>
            {/* <MenuItem > */}
            <Form
              action="/console/logout"
              method="POST"
              className="flex w-full p-2 list-none cursor-default hover:bg-slate-200 rounded-lg "
            >
              <Button
                type="submit"
                className="w-full text-left"
                variant="destructive"
              >
                Log out
              </Button>
            </Form>
            {/* </MenuItem> */}
          </Menu>
        </Dropdown>
      </section>
    </aside>
  );
}
