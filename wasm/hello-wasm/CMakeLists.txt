cmake_minimum_required(VERSION 3.14)

project(HELLO_CMAKE
  VERSION 0.1.0
  DESCRIPTION "HELLO_CMAKE"
)

set(CMAKE_CXX_STANDARD 11)

# set(CMAKE_C_STANDARD 11)
# set(CMAKE_C_STANDARD_REQUIRED ON)
# set(CMAKE_C_EXTENSIONS ON)

# set(CMAKE_CXX_STANDARD 14)
# set(CMAKE_CXX_STANDARD_REQUIRED ON)
# set(CMAKE_CXX_EXTENSIONS OFF)

# find_package(Threads REQUIRED)

add_executable(hello_cmake hello_cmake.cc hello_file.cc hello_thread.cc hello_c.c)

target_link_libraries(hello_cmake PRIVATE my_lib)

if (${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
  message("Emscripten env: ${CMAKE_SYSTEM_NAME}")
  # https://emscripten.org/docs/getting_started/FAQ.html?highlight=cmake#how-do-i-specify-s-options-in-a-cmake-project
  # MODULARIZE: 打包 umd; EXPORT_NAME: 导出模块名字 EXPORTED_RUNTIME_METHODS: 需要导出的模块; PTHREAD_POOL_SIZE=navigator.hardwareConcurrency 指定初始线程池为机器的核心数
  # --bind: 使用 embind;
  target_link_options(hello_cmake PRIVATE
    -sMODULARIZE=1
    -sEXPORT_NAME=HelloCmake
    -sEXPORTED_RUNTIME_METHODS=[FS,PIPEFS,cwrap,ccall,lengthBytesUTF8,stringToUTF8Array]
    -sPTHREAD_POOL_SIZE=navigator.hardwareConcurrency
    -sVERBOSE=1
    --bind
  )
  # -gsource-map 不能放在 target_link_options 中
  # https://emscripten.org/docs/porting/Debugging.html#debug-information
  set(EMSCRIPTEN_CFLAGS "-pthread -gsource-map")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${EMSCRIPTEN_CFLAGS}")
  set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${EMSCRIPTEN_CFLAGS}")
endif()

add_subdirectory(my_lib)
