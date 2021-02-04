#include <stdio.h>

#include "build/branding_buildflags.h"
#include "build/build_config.h"
#include "build/chromeos_buildflags.h"
#include "some/buildflags.h"

#if !BUILDFLAG(SOME_FLAG)
static_assert("Flag not defined");
#endif

int main(int argc, const char *argv[]) {
  printf("Passed\n");
  return 0;
}
