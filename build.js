var $ = require('shelljs')

if (!$.which('docker')) {
  $.echo(
    'This template requires Docker. Please install Docker and try again.',
  )
  $.exit(1)
}

$.mkdir('-p', 'build')
$.exec(
  `docker run --rm -v $(pwd):/src emscripten/emsdk \
   emcc \
   -O2 \
   --bind \
   --no-entry \
   -s EXTRA_EXPORTED_RUNTIME_METHODS='["getValue"]' \
   -s ALLOW_MEMORY_GROWTH=1 \
   -s DYNAMIC_EXECUTION=0 \
   -s TEXTDECODER=0 \
   -s MODULARIZE=1 \
   -s ENVIRONMENT=\'web\' \
   -s EXPORT_NAME="emscripten" \
   --pre-js './pre.js' \
   -lm \
   -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
   -I deps/include \
   -L deps/lib \
   -lglog \
   -labsl_bad_any_cast_impl\
   -labsl_log_severity \
   -labsl_bad_optional_access \
   -labsl_malloc_internal \
   -labsl_bad_variant_access\
   -labsl_periodic_sampler \
   -labsl_base \
   -labsl_random_distributions \
   -labsl_city \
   -labsl_random_internal_distribution_test_util \
   -labsl_civil_time\
   -labsl_random_internal_pool_urbg \
   -labsl_cord \
   -labsl_random_internal_randen \
   -labsl_debugging_internal\
   -labsl_random_internal_randen_hwaes \
   -labsl_demangle_internal\
   -labsl_random_internal_randen_hwaes_impl \
   -labsl_dynamic_annotations\
   -labsl_random_internal_randen_slow \
   -labsl_examine_stack\
   -labsl_random_internal_seed_material \
   -labsl_exponential_biased\
   -labsl_random_seed_gen_exception \
   -labsl_failure_signal_handler\
   -labsl_random_seed_sequences \
   -labsl_flags \
   -labsl_raw_hash_set \
   -labsl_flags_config\
   -labsl_raw_logging_internal \
   -labsl_flags_internal \
   -labsl_scoped_set_env \
   -labsl_flags_marshalling\
   -labsl_spinlock_wait \
   -labsl_flags_parse\
   -labsl_stacktrace \
   -labsl_flags_program_name\
   -labsl_status \
   -labsl_flags_registry\
   -labsl_str_format_internal \
   -labsl_flags_usage\
   -labsl_strings \
   -labsl_flags_usage_internal \
   -labsl_strings_internal \
   -labsl_graphcycles_internal \
   -labsl_symbolize \
   -labsl_hash \
   -labsl_synchronization \
   -labsl_hashtablez_sampler\
   -labsl_throw_delegate \
   -labsl_int128\
   -labsl_time \
   -labsl_leak_check\
   -labsl_time_zone \
   -labsl_leak_check_disable \
   -lCbc -lCbcSolver -lCgl -lClp -lClpSolver -lCoinUtils -lgflags_nothreads -lortools -lOsi -lOsiCbc -lOsiClp -lprotobuf -lscip -lz \
   -o ./build/module.js \
   ./src/sudoku.cc
   `,
)
