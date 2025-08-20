def get_country_from_timezone(tz_value):
    """
    Derive a country name from a timezone string.

    Tries, in order:
    - pytz.country_timezones + pycountry to return a full country name
    - pytz.country_names (fallback to country code -> name)
    - fallback to the last segment of the timezone (e.g. "Europe/Istanbul" -> "Istanbul")
    Returns None if tz_value is falsy.
    """
    if not tz_value:
        return None


    if isinstance(tz_value, str):
        tz = tz_value.split(",")[0].strip()
    else:
        tz = str(tz_value)

    try:
        import pytz

        for cc, tzs in getattr(pytz, "country_timezones", {}).items():
            if tz in tzs:
                country_code = cc.upper()
                try:
                    import pycountry

                    country = pycountry.countries.get(alpha_2=country_code)
                    if country:
                        return country.name
                except Exception:
                    pass
                country_name = getattr(pytz, "country_names", {}).get(cc)
                return country_name or country_code
    except Exception:
        pass

    if "/" in tz:
        return tz.split("/")[-1].replace("_", " ")
    return tz
