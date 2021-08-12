add_library(my_lib STATIC
  my_lib.cc
)

target_include_directories(my_lib INTERFACE ..)
