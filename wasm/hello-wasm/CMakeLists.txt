cmake_minimum_required(VERSION 3.14)

project(HELLO_CMAKE
  VERSION 0.1.0
  DESCRIPTION "HELLO_CMAKE"
)

set(CMAKE_CXX_STANDARD 11)

find_package(Threads REQUIRED)

add_executable(hello_cmake hello_cmake.cc hello_file.cc hello_thread.cc)

target_link_libraries(hello_cmake PRIVATE Threads::Threads my_lib)

if (${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
  message("Emscripten env: ${CMAKE_SYSTEM_NAME}")
  # https://emscripten.org/docs/getting_started/FAQ.html?highlight=cmake#how-do-i-specify-s-options-in-a-cmake-project
  # MODULARIZE: 打包 umd; EXPORT_NAME: 导出模块名字 EXPORTED_RUNTIME_METHODS: 需要导出的模块
  # --bind: 使用 embind; -O0: ; -g0: 
  target_link_options(hello_cmake PRIVATE -sMODULARIZE=1 -sEXPORT_NAME=HelloCmake -sEXPORTED_RUNTIME_METHODS=[FS,cwrap,ccall] -sPTHREAD_POOL_SIZE=navigator.hardwareConcurrency --bind)
  # -gsource-map 不能放在 target_link_options 中
  # https://emscripten.org/docs/porting/Debugging.html#debug-information
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -gsource-map -pthread")
endif()

add_subdirectory(my_lib)
