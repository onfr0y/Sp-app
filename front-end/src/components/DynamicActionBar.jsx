import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useNavigate } from 'react-router-dom'

export default function DynamicActionBar() {
  const containerRef = useRef(null)
  const detailsRef = useRef([])
  const itemsRef = useRef([])
  const navigate = useNavigate()

  // This state will keep track of which item is expanded (-1 means none)
  const [expandedIndex, setExpandedIndex] = useState(-1)

  const duration = 0.75
  const duration2 = 0.3
  const ease = 'elastic.out(1, 0.5)'

  useEffect(() => {
    // Handlers for detail "mouseleave" - close if we leave the hovered details
    detailsRef.current.forEach((detail) => {
      if (!detail) return
      detail.addEventListener('mouseleave', handleDetailLeave)
      return () => detail.removeEventListener('mouseleave', handleDetailLeave)
    })
  }, [])

  // Instead of handleMouseEnter, we do handleItemClick  
  const handleItemClick = (index) => {
    // If the clicked item is already expanded, we collapse it
    if (expandedIndex === index) {
      collapseDetails()
      return
    }

    // Otherwise, we expand the newly clicked item
    setExpandedIndex(index)
    expandItem(index)
  }

  // Expand logic
  const expandItem = (index) => {
    gsap.to(containerRef.current, {
      width: () => {
        switch (index) {
          case 0: return 500
          case 1: return 460
          case 2: return 480
          default: return 410
        }
      },
      height: () => {
        switch (index) {
          case 0: return 222 + 68
          case 1: return 194 + 68
          case 2: return 136 + 68
          default: return 48
        }
      },
      y: 17,
      borderRadius: 24,
      duration,
      ease,
    })

    detailsRef.current.forEach((detail, idx) => {
      if (!detail) return
      gsap.to(detail, {
        opacity: index === idx ? 1 : 0, 
        duration: duration2,
        zIndex: index === idx ? 2 : 1,
      })
    })
  }

  // Slight rename for clarity
  const handleDetailLeave = () => {
    // If the container or any item is hovered, don’t collapse
    // unless you always want to collapse on mouse leave of details.
    // If you want immediate collapse on detail leave:
    collapseDetails()
  }

  // Collapsing logic
  const collapseDetails = () => {
    setExpandedIndex(-1)
    gsap.to(containerRef.current, {
      width: 410,
      height: 48,
      y: 0,
      borderRadius: 16,
      duration,
      ease,
    })
    detailsRef.current.forEach((detail) => {
      if (!detail) return
      gsap.to(detail, {
        opacity: 0,
        duration: 0,
        zIndex: 1,
      })
    })
  }

  const handlePostClick = () => {
    navigate('/post')
  }

  return (
    <>
      {/* Wrapping container */}
      <div className="relative w-full h-screen overflow-hidden md:static md:h-screen">
        {/* For mobile, pinned at bottom */}
        <div
          className="fixed bottom-0 left-0 w-full md:relative md:flex md:items-center md:justify-center p-4 overflow-hidden bg-white/5"
          style={{ height: '100vh' }}
        >
          <div
            className="
              relative 
              w-full 
              h-full 
              md:rounded-2xl 
              bg-bg-gradient 
              overflow-hidden 
              md:flex
              md:items-center 
              md:justify-center
            "
          >
            {/* Action Bar */}
            <div
              className="
                border border-gray-200 dark:border-gray-700
                flex 
                items-center 
                justify-center 
                gap-2 
                rounded-2xl 
                bg-transparent 
                w-full
                bottom-0 
                left-0 
                absolute
                md:w-[410px] 
                md:-translate-x-1/2 
                md:left-1/2 
                md:bottom-14 
                z-[2]
              "
            >
              {/* Item 0 - On click, trigger expansion */}
              <button
                ref={(el) => (itemsRef.current[0] = el)}
                onClick={() => handleItemClick(0)}
                className="
                  flex 
                  items-center 
                  justify-center 
                  gap-2 
                  hover:bg-zinc-950 
                  hover:text-white 
                  duration-300 
                  transition-colors 
                  py-3 px-4 
                  rounded-2xl
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 7.125C2.25 6.504 2.754 
                      6 3.375 6h6c.621 0 1.125.504 
                      1.125 1.125v3.75c0 .621-.504 
                      1.125-1.125 1.125h-6a1.125 
                      1.125 0 0 1-1.125-1.125v-3.75ZM14.25 
                      8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 
                      0 1.125.504 1.125 1.125v8.25c0 .621-.504 
                      1.125-1.125 1.125h-5.25a1.125 1.125 0 0 
                      1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 
                      1.125-1.125h5.25c.621 0 1.125.504 1.125 
                      1.125v2.25c0 .621-.504 1.125-1.125 
                      1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
                  />
                </svg>
                <span className="font-bold">Apps</span>
              </button>

              {/* Item 1 */}
              <button
                ref={(el) => (itemsRef.current[1] = el)}
                onClick={() => {
                  // Expand details if you want, or just navigate
                  // handleItemClick(1)
                  // OR directly navigate, if that’s your desired action:
                  handlePostClick()
                }}
                className="
                  flex 
                  items-center 
                  justify-center 
                  gap-2 
                  hover:bg-zinc-950 
                  hover:text-white 
                  duration-300 
                  transition-colors 
                  py-3 px-4 
                  rounded-2xl
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 
                      5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3
                      -4.5 16.5"
                  />
                </svg>
                <span className="font-bold">Post</span>
              </button>

              {/* Item 2 - Expand on click */}
              <button
                ref={(el) => (itemsRef.current[2] = el)}
                onClick={() => handleItemClick(2)}
                className="
                  flex 
                  items-center 
                  justify-center 
                  gap-2 
                  hover:bg-zinc-950 
                  hover:text-white 
                  duration-300 
                  transition-colors 
                  py-3 px-4 
                  rounded-2xl
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 
                      3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 
                      8.987 0 0 1 6 18c2.305 0 4.408.867 6 
                      2.292m0-14.25a8.966 8.966 0 0 
                      1 6-2.292c1.052 0 2.062.18 3 
                      .512v14.25A8.987 8.987 0 0 0 18 
                      18a8.967 8.967 0 0 0-6 
                      2.292m0-14.25v14.25"
                  />
                </svg>
                <span className="font-bold">Share</span>
              </button>
            </div>

            {/* Container Box */}
            <div
              ref={containerRef}
              className="
                absolute 
                bg-black/5 
                backdrop-blur-xl 
                w-[410px] 
                h-12 
                -translate-x-1/2 
                left-1/2 
                bottom-14 
                overflow-hidden 
                rounded-2xl 
                container-block
                hidden
                md:block
              "
            >
              {/* Details 0 */}
              <div
                ref={(el) => (detailsRef.current[0] = el)}
                className="
                  p-4 flex flex-col items-center 
                  absolute w-full bottom-16 
                  opacity-0 details
                "
              >
                <div
                  className="
                    w-[95%] flex items-center gap-3 
                    cursor-pointer hover:bg-black/5 
                    rounded-2xl py-3 hover:px-3 duration-300
                  "
                >
                  <img
                    src="/gather.svg"
                    alt="gather"
                    className="w-16 rounded-xl object-cover h-16 shrink-0"
                  />
                  <div className="w-full flex flex-col items-start">
                    <p className="font-bold">Gather</p>
                    <p className="opacity-80">Virtual Office</p>
                  </div>
                  <span
                    className="
                      block shrink-0 
                      py-1 px-2 text-sm rounded-lg 
                      opacity-80 border border-black/50
                    "
                  >
                    Mac
                  </span>
                </div>
                <div
                  className="
                    w-[95%] flex items-center gap-3 
                    cursor-pointer hover:bg-black/5 
                    rounded-2xl py-3 hover:px-3 duration-300
                  "
                >
                  <img
                    src="/slack.svg"
                    alt="slack"
                    className="w-16 rounded-xl object-cover h-16 shrink-0"
                  />
                  <div className="w-full flex flex-col items-start">
                    <p className="font-bold">Slack</p>
                    <p className="opacity-80">Communication App</p>
                  </div>
                  <span
                    className="
                      block shrink-0 
                      py-1 px-2 text-sm rounded-lg 
                      opacity-80 border border-black/50
                    "
                  >
                    Windows
                  </span>
                </div>
                <div className="h-[2px] w-[95%] bg-black/10 mt-4"></div>
              </div>

              {/* Details 1 */}
              <div
                ref={(el) => (detailsRef.current[1] = el)}
                className="
                  py-4 px-6 flex flex-col items-center 
                  absolute w-full bottom-16 
                  opacity-0 details gap-1
                "
              >
                <div className="w-full group">
                  <div
                    className="
                      flex items-center justify-between w-full gap-3 
                      cursor-pointer group-hover:bg-black/5 
                      rounded-2xl py-2 group-hover:px-3 
                      group-hover:w-[95%] duration-300 mx-auto
                    "
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6 shrink-0 opacity-75"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 6.75 22.5 12l-5.25
                            5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                        />
                      </svg>
                      <span className="font-bold">New Post</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="
                          block shrink-0 py-1 px-2 text-sm 
                          rounded-lg opacity-80 border border-black/50
                        "
                      >
                        Dynamic
                      </span>
                      <span>06 - 12</span>
                    </div>
                  </div>
                </div>
                <div className="w-full group">
                  <div
                    className="
                      flex items-center justify-between w-full gap-3 
                      cursor-pointer group-hover:bg-black/5 
                      rounded-2xl py-2 group-hover:px-3 
                      group-hover:w-[95%] duration-300 mx-auto
                    "
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6 shrink-0 opacity-75"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 6.75 22.5 12l-5.25
                            5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                        />
                      </svg>
                      <span className="font-bold">Image Expand</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="
                          block shrink-0 py-1 px-2 text-sm 
                          rounded-lg opacity-80 border border-black/50
                        "
                      >
                        Overlay
                      </span>
                      <span>05 - 12</span>
                    </div>
                  </div>
                </div>
                <div className="w-full group">
                  <div
                    className="
                      flex items-center justify-between w-full gap-3 
                      cursor-pointer group-hover:bg-black/5 
                      rounded-2xl py-2 group-hover:px-3 
                      group-hover:w-[95%] duration-300 mx-auto
                    "
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6 shrink-0 opacity-75"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 6.75 22.5
                            12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                        />
                      </svg>
                      <span className="font-bold">Read Time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="
                          block shrink-0 py-1 px-2 text-sm 
                          rounded-lg opacity-80 border border-black/50
                        "
                      >
                        Scroll
                      </span>
                      <span>04 - 12</span>
                    </div>
                  </div>
                </div>
                <div className="h-[2px] w-full bg-black/10 mt-4"></div>
              </div>

              {/* Details 2 */}
              <div
                ref={(el) => (detailsRef.current[2] = el)}
                className="
                  p-4 flex flex-col items-center 
                  absolute w-full bottom-16 
                  opacity-0 details gap-1
                "
              >
                <div className="w-full group">
                  <div
                    className="
                      flex items-center justify-between w-full gap-3 
                      cursor-pointer group-hover:bg-black/5 
                      rounded-2xl py-2 group-hover:px-3 
                      group-hover:w-[95%] duration-300 mx-auto
                    "
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 0 1 
                            1.242 7.244l-4.5 4.5a4.5 4.5 
                            0 0 1-6.364-6.364l1.757-1.757m13.35-.622 
                            1.757-1.757a4.5 4.5 0 
                            0 0-6.364-6.364l-4.5 4.5a4.5
                            4.5 0 0 0 1.242 7.244"
                        />
                      </svg>
                      <span className="font-bold">Changelog using GitHub</span>
                    </div>
                    <span>Jun, 24</span>
                  </div>
                </div>
                <div className="w-full group">
                  <div
                    className="
                      flex items-center justify-between w-full gap-3 
                      cursor-pointer group-hover:bg-black/5 
                      rounded-2xl py-2 group-hover:px-3 
                      group-hover:w-[95%] duration-300 mx-auto
                    "
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 0 1 
                            1.242 7.244l-4.5 4.5a4.5 4.5 
                            0 0 1-6.364-6.364l1.757-1.757m13.35-.622 
                            1.757-1.757a4.5 4.5 
                            0 0 0-6.364-6.364l-4.5 4.5a4.5 
                            4.5 0 0 0 1.242 7.244"
                        />
                      </svg>
                      <span className="font-bold">Feedback in Slack</span>
                    </div>
                    <span>May, 24</span>
                  </div>
                </div>
                <div className="h-[2px] w-full bg-black/10 mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
