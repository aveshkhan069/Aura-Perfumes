-- AURA Perfumes: complete Supabase database bootstrap
-- Paste this whole file into Supabase Dashboard > SQL Editor > New query > Run.
-- Safe for a fresh project and re-runnable for this schema. It does not drop customer data.
-- Public/client code must use only the Supabase anon/publishable key; never use service_role here.

begin;

create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- Shared helpers
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Relational catalog and customer tables
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_aura_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

revoke all on function public.is_aura_admin() from public;
grant execute on function public.is_aura_admin() to anon, authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text not null,
  description text not null default '',
  short_description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) not null default 0 check (compare_at_price >= 0),
  currency text not null default 'INR',
  category text not null,
  gender text not null,
  fragrance_family text not null default '',
  concentration text not null default '',
  size text not null default '',
  available_sizes jsonb not null default '[]'::jsonb,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  sku text not null unique,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  primary_image text,
  hover_image text,
  images jsonb not null default '[]'::jsonb,
  ingredients text not null default '',
  notes jsonb not null default '{}'::jsonb,
  longevity text not null default '',
  sillage text not null default '',
  season text not null default '',
  occasion text not null default '',
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  is_new_arrival boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  image_type text not null default 'gallery' check (image_type in ('primary', 'hover', 'gallery', 'detail')),
  sort_order integer not null default 0 check (sort_order >= 0),
  alt_text text not null default '',
  created_at timestamptz not null default now(),
  unique (product_id, sort_order)
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text not null default '',
  review_text text not null,
  is_verified_purchase boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price_at_time numeric(12,2) not null check (price_at_time >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create sequence if not exists public.aura_order_number_seq start with 1;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  order_number text not null unique default (
    'AURA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.aura_order_number_seq')::text, 6, '0')
  ),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  shipping_amount numeric(12,2) not null default 0 check (shipping_amount >= 0),
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text not null default 'cod' check (payment_method in ('card', 'upi', 'cod')),
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_postal_code text not null,
  shipping_country text not null,
  coupon_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total_price numeric(12,2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  description text not null default '',
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_order_amount numeric(12,2) not null default 0 check (minimum_order_amount >= 0),
  max_discount numeric(12,2) check (max_discount is null or max_discount >= 0),
  usage_limit integer check (usage_limit is null or usage_limit >= 0),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes used by storefront search, filters, ownership queries and history.
create index if not exists products_active_category_idx on public.products (category, is_active);
create index if not exists products_active_brand_idx on public.products (brand, is_active);
create index if not exists products_price_idx on public.products (price) where is_active;
create index if not exists products_family_idx on public.products (fragrance_family) where is_active;
create index if not exists products_featured_idx on public.products (is_featured, created_at desc) where is_active;
create index if not exists products_newest_idx on public.products (created_at desc) where is_active;
create index if not exists products_search_idx on public.products using gin (
  to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(brand, '') || ' ' || coalesce(category, '') || ' ' || coalesce(fragrance_family, ''))
);
create index if not exists product_images_product_sort_idx on public.product_images (product_id, sort_order);
create index if not exists reviews_product_published_idx on public.product_reviews (product_id, is_published, created_at desc);
create index if not exists wishlist_items_product_idx on public.wishlist_items (product_id);
create index if not exists cart_items_cart_idx on public.cart_items (cart_id);
create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists addresses_user_idx on public.addresses (user_id);
create unique index if not exists addresses_one_default_per_user_idx on public.addresses (user_id) where is_default;
create unique index if not exists coupons_code_ci_idx on public.coupons (lower(code));

-- -----------------------------------------------------------------------------
-- Auth profile bootstrap, address defaults and timestamps
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, ''),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  insert into public.carts (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.wishlists (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Keep existing Auth users usable when this one-file setup is applied later.
insert into public.profiles (id, full_name, email, role)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', ''), coalesce(u.email, ''), 'customer'
from auth.users u
on conflict (id) do update set email = excluded.email, updated_at = now();
insert into public.carts (user_id) select p.id from public.profiles p on conflict (user_id) do nothing;
insert into public.wishlists (user_id) select p.id from public.profiles p on conflict (user_id) do nothing;

create or replace function public.set_default_address()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_default then
    update public.addresses
       set is_default = false
     where user_id = new.user_id and id is distinct from new.id and is_default;
  end if;
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists addresses_default_before_write on public.addresses;
create trigger addresses_default_before_write
  before insert or update on public.addresses
  for each row execute function public.set_default_address();

-- Generic updated_at triggers.
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists reviews_set_updated_at on public.product_reviews;
create trigger reviews_set_updated_at before update on public.product_reviews for each row execute function public.set_updated_at();
drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at before update on public.carts for each row execute function public.set_updated_at();
drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at before update on public.addresses for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.addresses enable row level security;

-- Remove policies with these names so this complete script may be rerun safely.
drop policy if exists profiles_select_owner_or_admin on public.profiles;
drop policy if exists profiles_update_owner on public.profiles;
drop policy if exists products_read_active on public.products;
drop policy if exists products_admin_manage on public.products;
drop policy if exists product_images_read_active on public.product_images;
drop policy if exists product_images_admin_manage on public.product_images;
drop policy if exists reviews_read_published_or_owner on public.product_reviews;
drop policy if exists reviews_insert_self on public.product_reviews;
drop policy if exists reviews_admin_manage on public.product_reviews;
drop policy if exists wishlists_owner_all on public.wishlists;
drop policy if exists wishlist_items_owner_all on public.wishlist_items;
drop policy if exists carts_owner_read on public.carts;
drop policy if exists cart_items_owner_read_delete on public.cart_items;
drop policy if exists orders_owner_or_admin_read on public.orders;
drop policy if exists orders_admin_update on public.orders;
drop policy if exists order_items_owner_or_admin_read on public.order_items;
drop policy if exists coupons_read_active on public.coupons;
drop policy if exists coupons_admin_manage on public.coupons;
drop policy if exists addresses_owner_all on public.addresses;

create policy profiles_select_owner_or_admin on public.profiles
  for select to authenticated using (id = (select auth.uid()) or public.is_aura_admin());
create policy profiles_update_owner on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy products_read_active on public.products
  for select to anon, authenticated using (is_active or public.is_aura_admin());
create policy products_admin_manage on public.products
  for all to authenticated using (public.is_aura_admin()) with check (public.is_aura_admin());

create policy product_images_read_active on public.product_images
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.is_active)
    or public.is_aura_admin()
  );
create policy product_images_admin_manage on public.product_images
  for all to authenticated using (public.is_aura_admin()) with check (public.is_aura_admin());

create policy reviews_read_published_or_owner on public.product_reviews
  for select to anon, authenticated using (is_published or user_id = (select auth.uid()) or public.is_aura_admin());
create policy reviews_insert_self on public.product_reviews
  for insert to authenticated with check (
    user_id = (select auth.uid()) and is_published = false and is_verified_purchase = false
  );
create policy reviews_admin_manage on public.product_reviews
  for all to authenticated using (public.is_aura_admin()) with check (public.is_aura_admin());

create policy wishlists_owner_all on public.wishlists
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy wishlist_items_owner_all on public.wishlist_items
  for all to authenticated using (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = (select auth.uid()))
    and exists (select 1 from public.products p where p.id = product_id and p.is_active)
  );

create policy carts_owner_read on public.carts
  for select to authenticated using (user_id = (select auth.uid()));
create policy cart_items_owner_read_delete on public.cart_items
  for select to authenticated using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()))
  );
create policy cart_items_owner_delete on public.cart_items
  for delete to authenticated using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid()))
  );

create policy orders_owner_or_admin_read on public.orders
  for select to authenticated using (user_id = (select auth.uid()) or public.is_aura_admin());
create policy orders_admin_update on public.orders
  for update to authenticated using (public.is_aura_admin()) with check (public.is_aura_admin());
create policy order_items_owner_or_admin_read on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or public.is_aura_admin()))
  );

create policy coupons_read_active on public.coupons
  for select to anon, authenticated using (
    (is_active and (expires_at is null or expires_at > now())) or public.is_aura_admin()
  );
create policy coupons_admin_manage on public.coupons
  for all to authenticated using (public.is_aura_admin()) with check (public.is_aura_admin());

create policy addresses_owner_all on public.addresses
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Explicit grants: RLS limits rows; column/table grants limit what customers can change.
revoke all on public.profiles, public.products, public.product_images, public.product_reviews,
  public.wishlists, public.wishlist_items, public.carts, public.cart_items,
  public.orders, public.order_items, public.coupons, public.addresses
  from anon, authenticated;

grant select on public.products, public.product_images, public.coupons to anon, authenticated;
grant insert, update, delete on public.products, public.product_images to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url, updated_at) on public.profiles to authenticated;
grant select on public.product_reviews to anon, authenticated;
grant insert, update, delete on public.product_reviews to authenticated;
grant select, insert, delete on public.wishlists, public.wishlist_items to authenticated;
grant select on public.carts to authenticated;
grant select, delete on public.cart_items to authenticated;
grant select on public.orders, public.order_items to authenticated;
grant update (status, payment_status) on public.orders to authenticated;
grant insert, update, delete on public.coupons to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;

-- -----------------------------------------------------------------------------
-- Trusted cart and order operations
-- Clients never submit cart prices or order totals; prices and stock come from products.
-- -----------------------------------------------------------------------------
create or replace function public.add_to_cart(p_product_id uuid, p_quantity integer default 1)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_cart_id uuid;
  v_item_id uuid;
  v_price numeric(12,2);
  v_stock integer;
  v_current_quantity integer;
begin
  if v_user_id is null then raise exception 'Sign in required'; end if;
  if p_quantity is null or p_quantity < 1 then raise exception 'Quantity must be at least one'; end if;

  select c.id into v_cart_id from public.carts c where c.user_id = v_user_id for update;
  if v_cart_id is null then
    insert into public.carts (user_id) values (v_user_id) returning id into v_cart_id;
  end if;

  select p.price, p.stock_quantity into v_price, v_stock
    from public.products p where p.id = p_product_id and p.is_active for update;
  if not found then raise exception 'Product is unavailable'; end if;

  select ci.id, ci.quantity into v_item_id, v_current_quantity
    from public.cart_items ci where ci.cart_id = v_cart_id and ci.product_id = p_product_id;
  if coalesce(v_current_quantity, 0) + p_quantity > v_stock then raise exception 'Requested quantity exceeds available stock'; end if;

  if v_item_id is null then
    insert into public.cart_items (cart_id, product_id, quantity, price_at_time)
    values (v_cart_id, p_product_id, p_quantity, v_price) returning id into v_item_id;
  else
    update public.cart_items set quantity = v_current_quantity + p_quantity, price_at_time = v_price
      where id = v_item_id;
  end if;
  return v_item_id;
end;
$$;

create or replace function public.set_cart_item_quantity(p_cart_item_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_product_id uuid;
  v_cart_id uuid;
  v_stock integer;
  v_price numeric(12,2);
begin
  if v_user_id is null then raise exception 'Sign in required'; end if;
  if p_quantity is null or p_quantity < 1 then raise exception 'Quantity must be at least one'; end if;
  select ci.product_id, ci.cart_id into v_product_id, v_cart_id
    from public.cart_items ci join public.carts c on c.id = ci.cart_id
    where ci.id = p_cart_item_id and c.user_id = v_user_id;
  if not found then raise exception 'Cart item not found'; end if;
  select p.stock_quantity, p.price into v_stock, v_price from public.products p
    where p.id = v_product_id and p.is_active for update;
  if not found then raise exception 'Product is unavailable'; end if;
  if p_quantity > v_stock then raise exception 'Requested quantity exceeds available stock'; end if;
  update public.cart_items set quantity = p_quantity, price_at_time = v_price where id = p_cart_item_id;
end;
$$;

create or replace function public.remove_cart_item(p_cart_item_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  delete from public.cart_items ci using public.carts c
   where ci.cart_id = c.id and c.user_id = auth.uid() and ci.id = p_cart_item_id;
end;
$$;

create or replace function public.create_order(
  p_shipping jsonb,
  p_payment_method text default 'cod',
  p_coupon_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_cart_id uuid;
  v_line record;
  v_coupon public.coupons%rowtype;
  v_subtotal numeric(12,2) := 0;
  v_shipping_amount numeric(12,2) := 0;
  v_discount numeric(12,2) := 0;
  v_total numeric(12,2) := 0;
  v_order_id uuid;
  v_result jsonb;
begin
  if v_user_id is null then raise exception 'Sign in required'; end if;
  if jsonb_typeof(p_shipping) <> 'object' then raise exception 'Shipping details are required'; end if;
  if coalesce(p_shipping->>'fullName', '') = '' or coalesce(p_shipping->>'email', '') = ''
     or coalesce(p_shipping->>'phone', '') = '' or coalesce(p_shipping->>'address', '') = ''
     or coalesce(p_shipping->>'city', '') = '' or coalesce(p_shipping->>'state', '') = ''
     or coalesce(p_shipping->>'pinCode', '') = '' or coalesce(p_shipping->>'country', '') = '' then
    raise exception 'Complete all required shipping details';
  end if;
  if p_payment_method is null or p_payment_method not in ('card', 'upi', 'cod') then
    raise exception 'Unsupported payment method';
  end if;

  select c.id into v_cart_id from public.carts c where c.user_id = v_user_id for update;
  if v_cart_id is null then raise exception 'Your cart is empty'; end if;

  -- Lock product rows before checking stock and calculating trusted current prices.
  for v_line in
    select ci.product_id, ci.quantity, p.name, p.primary_image, p.price, p.stock_quantity
      from public.cart_items ci
      join public.products p on p.id = ci.product_id
     where ci.cart_id = v_cart_id and p.is_active
     order by p.id
     for update of p
  loop
    if v_line.quantity > v_line.stock_quantity then
      raise exception 'Insufficient stock for %', v_line.name;
    end if;
    v_subtotal := v_subtotal + (v_line.price * v_line.quantity);
  end loop;
  if v_subtotal <= 0 then raise exception 'Your cart is empty'; end if;

  v_shipping_amount := case when v_subtotal >= 999 then 0 else 99 end;
  if nullif(trim(coalesce(p_coupon_code, '')), '') is not null then
    select * into v_coupon from public.coupons c
     where lower(c.code) = lower(trim(p_coupon_code)) for update;
    if not found or not v_coupon.is_active or (v_coupon.expires_at is not null and v_coupon.expires_at <= now()) then
      raise exception 'Coupon is invalid or expired';
    end if;
    if v_coupon.usage_limit is not null and v_coupon.used_count >= v_coupon.usage_limit then
      raise exception 'Coupon usage limit has been reached';
    end if;
    if v_subtotal < v_coupon.minimum_order_amount then raise exception 'Order does not meet the coupon minimum'; end if;
    if v_coupon.discount_type = 'percentage' then
      v_discount := round(v_subtotal * v_coupon.discount_value / 100, 2);
    else
      v_discount := v_coupon.discount_value;
    end if;
    if v_coupon.max_discount is not null then v_discount := least(v_discount, v_coupon.max_discount); end if;
    v_discount := least(v_discount, v_subtotal);
  end if;
  v_total := greatest(0, v_subtotal + v_shipping_amount - v_discount);

  insert into public.orders (
    user_id, subtotal, shipping_amount, discount_amount, total_amount, currency,
    status, payment_status, payment_method, shipping_name, shipping_email, shipping_phone,
    shipping_address, shipping_city, shipping_state, shipping_postal_code, shipping_country, coupon_code
  ) values (
    v_user_id, v_subtotal, v_shipping_amount, v_discount, v_total, 'INR',
    'pending', 'pending', p_payment_method,
    p_shipping->>'fullName', p_shipping->>'email', p_shipping->>'phone',
    concat_ws(', ', p_shipping->>'address', nullif(p_shipping->>'apartment', '')),
    p_shipping->>'city', p_shipping->>'state', p_shipping->>'pinCode', p_shipping->>'country',
    nullif(upper(trim(coalesce(p_coupon_code, ''))), '')
  ) returning id into v_order_id;

  for v_line in
    select ci.product_id, ci.quantity, p.name, p.primary_image, p.price
      from public.cart_items ci join public.products p on p.id = ci.product_id
     where ci.cart_id = v_cart_id and p.is_active order by p.id
  loop
    insert into public.order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price)
    values (v_order_id, v_line.product_id, v_line.name, v_line.primary_image, v_line.quantity,
            v_line.price, v_line.price * v_line.quantity);
    update public.products set stock_quantity = stock_quantity - v_line.quantity where id = v_line.product_id;
  end loop;

  if nullif(trim(coalesce(p_coupon_code, '')), '') is not null then
    update public.coupons set used_count = used_count + 1 where id = v_coupon.id;
  end if;
  delete from public.cart_items where cart_id = v_cart_id;
  select to_jsonb(o) into v_result from public.orders o where o.id = v_order_id;
  return v_result;
end;
$$;

revoke all on function public.add_to_cart(uuid, integer) from public, anon;
revoke all on function public.set_cart_item_quantity(uuid, integer) from public, anon;
revoke all on function public.remove_cart_item(uuid) from public, anon;
revoke all on function public.create_order(jsonb, text, text) from public, anon;
grant execute on function public.add_to_cart(uuid, integer) to authenticated;
grant execute on function public.set_cart_item_quantity(uuid, integer) to authenticated;
grant execute on function public.remove_cart_item(uuid) to authenticated;
grant execute on function public.create_order(jsonb, text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Aura Perfumes seed catalog (La Vie Est Belle and Good Girl remain hidden as requested).
-- Images use the existing local catalog assets; the second/tilted angle is intentionally omitted.
-- -----------------------------------------------------------------------------
insert into public.products (
  name, slug, brand, description, short_description, price, compare_at_price, currency,
  category, gender, fragrance_family, concentration, size, available_sizes,
  stock_quantity, sku, rating, review_count, primary_image, hover_image, images,
  ingredients, notes, longevity, sillage, season, occasion,
  is_featured, is_bestseller, is_new_arrival, is_active
) values
(
  'AURA Noir','aura-noir-eau-de-parfum','AURA',
  'A bold and sophisticated fragrance for the modern man. AURA Noir blends fresh citrus with warm woody notes, leaving a lasting impression wherever you go.',
  'Bold woody-spicy fragrance with Italian bergamot, smoky cedarwood, and radiant amber.',1999,2499,'INR','Men','Men','Woody','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1399,"originalPrice":1799},{"size":"100ml","price":1999,"originalPrice":2499}]'::jsonb,
  42,'AURA-NOIR-100',4.8,124,'/src/assets/images/products/aura-noir_1.jpg',null,
  '["/src/assets/images/products/aura-noir_1.jpg","/src/assets/images/products/aura-noir_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Citronellol, Geraniol.',
  '{"top":["Bergamot","Lemon","Black Pepper"],"heart":["Lavender","Cedarwood","Geranium"],"base":["Musk","Amber","Vanilla"]}'::jsonb,
  '8-10 Hours','Moderate to Strong','Autumn / Winter / Evening','Formal, Date Night, Black Tie',true,true,false,true
),
(
  'Velvet Rose','velvet-rose-eau-de-parfum','AURA',
  'An ode to timeless romance and delicate allure. Velvet Rose opens with lush dewy petals and juicy lychee, evolving into velvety rose with soft cashmere and vanilla.',
  'Opulent floral masterpiece pairing Turkish rose with velvety cashmere and vanilla.',2499,2999,'INR','Women','Women','Floral','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1699,"originalPrice":2099},{"size":"100ml","price":2499,"originalPrice":2999}]'::jsonb,
  28,'AURA-VELVET-ROSE-100',4.9,98,'/src/assets/images/products/velvet-rose_1.jpg',null,
  '["/src/assets/images/products/velvet-rose_1.jpg","/src/assets/images/products/velvet-rose_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Alpha-Isomethyl Ionone, Hydroxycitronellal, Eugenol, Benzyl Salicylate.',
  '{"top":["Turkish Rose","Pink Lychee","Calabrian Bergamot"],"heart":["Peony","Damascena Rose","Warm Nutmeg"],"base":["Cashmeran","Bourbon Vanilla","White Musk"]}'::jsonb,
  '9-11 Hours','Strong & Intoxicating','All Seasons / Spring & Evening','Romantic Dinners, Weddings, Signature Daily',true,true,false,true
),
(
  'Citrus Dream','citrus-dream-eau-de-parfum','AURA',
  'Awaken your senses to sun-drenched Italian groves. Citrus Dream harmonizes sparkling citrus blossoms with aromatic woods for an invigorating, uplifted aura.',
  'Zesty Mediterranean citrus harmonized with white blossoms and cedar.',1799,2199,'INR','Unisex','Unisex','Citrus','Eau de Parfum','50ml',
  '[{"size":"50ml","price":1799,"originalPrice":2199},{"size":"100ml","price":2599,"originalPrice":3199}]'::jsonb,
  55,'AURA-CITRUS-DREAM-50',4.7,64,'/src/assets/images/products/citrus-dream_1.jpg',null,
  '["/src/assets/images/products/citrus-dream_1.jpg","/src/assets/images/products/citrus-dream_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Limonene, Aqua (Water), Linalool, Citral, Farnesol.',
  '{"top":["Sicilian Lemon","Mandarin Orange","Neroli Essence"],"heart":["Orange Blossom","Night Jasmine","Petitgrain"],"base":["Cedarwood","White Amber","Clean Vetiver"]}'::jsonb,
  '7-9 Hours','Moderate & Crisp','Spring / Summer / Daytime','Daily Workwear, Weekend Brunch, Vacations',true,true,false,true
),
(
  'Ocean Breeze','ocean-breeze-eau-de-parfum','AURA',
  'Capture the untamed power and calm majesty of coastal waves crashing upon rocky shores. Deep, aquatic, and enduringly masculine.',
  'Crisp aquatic energy with ozonic sea salt, Mediterranean herbs, and driftwood.',2099,2599,'INR','Men','Men','Fresh','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1499,"originalPrice":1899},{"size":"100ml","price":2099,"originalPrice":2599}]'::jsonb,
  36,'AURA-OCEAN-BREEZE-100',4.6,81,'/src/assets/images/products/ocean-breeze_1.jpg',null,
  '["/src/assets/images/products/ocean-breeze_1.jpg","/src/assets/images/products/ocean-breeze_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Benzoate, Limonene, Evernia Prunastri Extract.',
  '{"top":["Mineral Sea Salt","Calamansi Lime","Crisp Ozonic Accord"],"heart":["Rosemary","Clary Sage","Wild Geranium"],"base":["Sun-bleached Driftwood","Indonesian Patchouli","Ambergris"]}'::jsonb,
  '8-10 Hours','Strong','Spring / Summer','Sport, Casual Day, Outdoor Gatherings',true,true,false,true
),
(
  'Blush','blush-eau-de-parfum','AURA',
  'A whisper of powdered silk and blushed blossoms. Sweet and playful yet deeply sophisticated with caramelized praline and iris.',
  'Delicate floral gourmand with wild red berries, dewy magnolia, and creamy praline.',2299,2799,'INR','Women','Women','Floral','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1599,"originalPrice":1999},{"size":"100ml","price":2299,"originalPrice":2799}]'::jsonb,
  45,'AURA-BLUSH-100',4.8,52,'/src/assets/images/products/blush_1.jpg',null,
  '["/src/assets/images/products/blush_1.jpg","/src/assets/images/products/blush_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Hexyl Cinnamal, Citronellol, Coumarin.',
  '{"top":["Pink Pepper","Wild Red Berries","White Peach"],"heart":["Lily of the Valley","Sweet Magnolia","Tuscan Iris"],"base":["Sandalwood","Golden Praline","Soft Silk Musk"]}'::jsonb,
  '7-9 Hours','Moderate & Alluring','All Seasons / Daytime','High Tea, Office, Everyday Elegance',true,true,true,true
),
(
  'Mystic Oud','mystic-oud-eau-de-parfum','AURA',
  'An enigmatic ritual of Arabian nights, pairing aged Assam agarwood with crimson saffron and intoxicating resinous notes.',
  'Hypnotic Middle-Eastern oud steeped in saffron, dark incense, and velvety leather.',3499,4299,'INR','Unisex','Unisex','Oriental','Eau de Parfum','100ml',
  '[{"size":"50ml","price":2299,"originalPrice":2799},{"size":"100ml","price":3499,"originalPrice":4299}]'::jsonb,
  19,'AURA-MYSTIC-OUD-100',4.9,110,'/src/assets/images/products/mystic-oud_1.jpg',null,
  '["/src/assets/images/products/mystic-oud_1.jpg","/src/assets/images/products/mystic-oud_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Cinnamyl Alcohol, Isoeugenol, Farnesol.',
  '{"top":["Rare Saffron","Nutmeg","Smoky Incense"],"heart":["Assam Agarwood (Oud)","Black Rose","Leather Accord"],"base":["Laotian Benzoin","Dark Amber","Patchouli Oil"]}'::jsonb,
  '12+ Hours','Heavy & Regal','Autumn / Winter','Royal Gala, Celebrations, Winter Evenings',true,true,false,true
),
(
  'Sauvage','dior-sauvage-eau-de-toilette','Dior',
  'A radically fresh composition of bright bergamot, spicy pepper and noble woods.',
  'The worldwide benchmark of magnetic fresh spicy elegance and radiant Ambroxan.',8999,9999,'INR','Men','Men','Aromatic','Eau de Toilette','100ml',
  '[{"size":"60ml","price":6899,"originalPrice":7599},{"size":"100ml","price":8999,"originalPrice":9999}]'::jsonb,
  24,'DIOR-SAUVAGE-100',4.9,412,'/src/assets/images/products/dior-sauvage_1.jpg',null,
  '["/src/assets/images/products/dior-sauvage_1.jpg","/src/assets/images/products/dior-sauvage_3.jpg"]'::jsonb,
  'Alcohol, Aqua, Parfum, Limonene, Linalool, Ethylhexyl Methoxycinnamate, Citronellol, Coumarin.',
  '{"top":["Calabrian Bergamot","Spicy Pepper"],"heart":["Sichuan Pepper","Lavender","Pink Pepper","Vetiver","Patchouli","Geranium","Elemi"],"base":["Ambroxan","Cedar","Labdanum"]}'::jsonb,
  '9-12 Hours','Enormous','Versatile / All Seasons','Signature Everyday, Night Out, High Impact',false,true,false,true
),
(
  'Bleu de Chanel','bleu-de-chanel-eau-de-parfum','Chanel',
  'A tribute to masculine freedom in a woody aromatic fragrance with a captivating trail.',
  'Citrus freshness and smoky amber wood in a timeless masculine composition.',10499,11999,'INR','Men','Men','Woody','Eau de Parfum','100ml',
  '[{"size":"50ml","price":7499,"originalPrice":8499},{"size":"100ml","price":10499,"originalPrice":11999}]'::jsonb,
  18,'CHANEL-BLEU-100',4.9,388,'/src/assets/images/products/bleu-de-chanel_1.jpg',null,
  '["/src/assets/images/products/bleu-de-chanel_1.jpg","/src/assets/images/products/bleu-de-chanel_3.jpg"]'::jsonb,
  'Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Alpha-Isomethyl Ionone.',
  '{"top":["Grapefruit","Lemon","Mint","Pink Pepper","Bergamot"],"heart":["Ginger","Nutmeg","Jasmine","Iso E Super"],"base":["Incense","Vetiver","Cedar","Sandalwood","Patchouli","Labdanum","White Musk"]}'::jsonb,
  '8-10 Hours','Moderate & Elegant','All Seasons','Executive Meetings, Fine Dining, Black Tie',false,true,false,true
),
(
  'Coco Mademoiselle','chanel-coco-mademoiselle-eau-de-parfum','Chanel',
  'The essence of a bold and free woman, sparkling with vibrant orange and refined patchouli.',
  'A modern classic blending sparkling citrus with rose and refined patchouli.',11200,12500,'INR','Women','Women','Oriental','Eau de Parfum','100ml',
  '[{"size":"50ml","price":7900,"originalPrice":8900},{"size":"100ml","price":11200,"originalPrice":12500}]'::jsonb,
  22,'CHANEL-COCO-100',4.9,420,'/src/assets/images/products/chanel-coco-mademoiselle_1.jpg',null,
  '["/src/assets/images/products/chanel-coco-mademoiselle_1.jpg","/src/assets/images/products/chanel-coco-mademoiselle_3.jpg"]'::jsonb,
  'Alcohol, Parfum (Fragrance), Aqua (Water), Linalool, Limonene, Benzyl Salicylate, Geraniol.',
  '{"top":["Orange","Mandarin Orange","Bergamot","Orange Blossom"],"heart":["Turkish Rose","Jasmine","Mimosa","Ylang-Ylang"],"base":["Patchouli","White Musk","Vanilla","Vetiver","Tonka Bean","Opoponax"]}'::jsonb,
  '10-12 Hours','Radiant & Luxurious','All Seasons','Signature Daily, Executive, Glamorous Evenings',false,true,false,true
),
(
  'Oud Wood','tom-ford-oud-wood-eau-de-parfum','Tom Ford',
  'A rare private blend of oud wood, rosewood, cardamom and creamy sandalwood.',
  'Smoky agarwood, cardamom, and creamy sandalwood in an intimate luxury blend.',18500,20000,'INR','Unisex','Unisex','Woody','Eau de Parfum','50ml',
  '[{"size":"50ml","price":18500,"originalPrice":20000},{"size":"100ml","price":27900,"originalPrice":30000}]'::jsonb,
  12,'TOM-FORD-OUD-50',4.8,260,'/src/assets/images/products/tom-ford-oud-wood_1.jpg',null,
  '["/src/assets/images/products/tom-ford-oud-wood_1.jpg","/src/assets/images/products/tom-ford-oud-wood_3.jpg"]'::jsonb,
  'Alcohol Denat., Fragrance (Parfum), Water, Linalool, Hydroxycitronellal, Coumarin, Limonene.',
  '{"top":["Rare Oud Wood","Rosewood","Cardamom"],"heart":["Sichuan Pepper","Sandalwood","Vetiver"],"base":["Tonka Bean","Vanilla","Amber"]}'::jsonb,
  '8-10 Hours','Subtle & Intimate Luxury','Autumn / Winter','VIP Events, Private Dinners, Connoisseur Wear',true,false,true,true
),
(
  'Eros','versace-eros-eau-de-toilette','Versace',
  'A vibrant masculine fragrance balancing mint, Italian lemon, green apple and warm woods.',
  'Luminous mint zest, crisp green apple, and creamy vanilla with magnetic sillage.',6499,7499,'INR','Men','Men','Fresh','Eau de Toilette','100ml',
  '[{"size":"50ml","price":4799,"originalPrice":5499},{"size":"100ml","price":6499,"originalPrice":7499}]'::jsonb,
  30,'VERSACE-EROS-100',4.7,215,'/src/assets/images/products/versace-eros_1.jpg',null,
  '["/src/assets/images/products/versace-eros_1.jpg","/src/assets/images/products/versace-eros_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Coumarin, Linalool, Ethylhexyl Methoxycinnamate.',
  '{"top":["Mint Leaves","Italian Lemon Zest","Green Apple"],"heart":["Tonka Bean","Ambroxan","Geranium Flower"],"base":["Vanilla","Atlas Cedarwood","Vetiver","Oakmoss"]}'::jsonb,
  '8-11 Hours','Strong & Party Ready','All Seasons / Night','Clubs, Parties, Social Gatherings',false,true,false,true
),
(
  'Acqua di Giò','giorgio-armani-acqua-di-gio-eau-de-toilette','Giorgio Armani',
  'Inspired by the fresh sea, warm sun and the richness of the earth.',
  'A marine classic with sea water, citrus orchards, and sun-warmed woods.',7299,8199,'INR','Men','Men','Fresh','Eau de Toilette','100ml',
  '[{"size":"50ml","price":5199,"originalPrice":5899},{"size":"100ml","price":7299,"originalPrice":8199}]'::jsonb,
  25,'ARMANI-ACQUA-100',4.8,340,'/src/assets/images/products/armani-acqua-di-gio_1.jpg',null,
  '["/src/assets/images/products/armani-acqua-di-gio_1.jpg","/src/assets/images/products/armani-acqua-di-gio_3.jpg"]'::jsonb,
  'Alcohol, Aqua, Parfum, BHT, Linalool, Geraniol, Eugenol, Alpha-Isomethyl Ionone.',
  '{"top":["Calabrian Bergamot","Neroli","Green Tangerine"],"heart":["Marine Notes","Jasmine","Rosemary","Persimmon"],"base":["Cedar","Patchouli","White Musk","Amber"]}'::jsonb,
  '6-8 Hours','Crisp & Airy','Summer / Spring','Office, Weekend Casual, Beach Holidays',false,false,false,true
),
(
  'Y Eau de Parfum','yves-saint-laurent-y-eau-de-parfum','Yves Saint Laurent',
  'Fresh apple and ginger contrast with aromatic sage and woody amber.',
  'Crisp green apple, sharp ginger, and intense woody amber for the modern achiever.',8200,9400,'INR','Men','Men','Aromatic','Eau de Parfum','100ml',
  '[{"size":"60ml","price":6100,"originalPrice":6900},{"size":"100ml","price":8200,"originalPrice":9400}]'::jsonb,
  26,'YSL-Y-100',4.8,195,'/src/assets/images/products/ysl-y_1.jpg',null,
  '["/src/assets/images/products/ysl-y_1.jpg","/src/assets/images/products/ysl-y_3.jpg"]'::jsonb,
  'Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Butyl Methoxydibenzoylmethane.',
  '{"top":["Apple","Ginger","Bergamot"],"heart":["Sage","Juniper Berries","Geranium"],"base":["Amberwood","Tonka Bean","Cedar","Vetiver","Olibanum"]}'::jsonb,
  '9-12 Hours','Strong & Projective','All Seasons','Office Power Moves, Date Nights, Signature Scent',false,false,true,true
),
(
  'Santal Sublime','aura-santal-sublime-eau-de-parfum','AURA',
  'Creamy Australian sandalwood embraced by violet leaves and dry smoked papyrus.',
  'Sensual creamy sandalwood laced with violet leaf and delicate leather undertones.',2699,3299,'INR','Unisex','Unisex','Woody','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1899,"originalPrice":2299},{"size":"100ml","price":2699,"originalPrice":3299}]'::jsonb,
  40,'AURA-SANTAL-100',4.8,76,'/src/assets/images/products/aura-santal-sublime_1.jpg',null,
  '["/src/assets/images/products/aura-santal-sublime_1.jpg","/src/assets/images/products/aura-santal-sublime_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Farnesol, Eugenol, Isoeugenol.',
  '{"top":["Australian Sandalwood","Papyrus","Cardamom"],"heart":["Violet Leaf","Tuscan Leather","Smoky Cedar"],"base":["White Musk","Warm Amber","Haitian Vetiver"]}'::jsonb,
  '10-12 Hours','Moderate & Addictive','Autumn / Spring / Winter','Creative Workspaces, Art Galleries, Cozy Evenings',true,false,true,true
),
(
  'Golden Amber','aura-golden-amber-eau-de-parfum','AURA',
  'Radiant ambergris, spun caramel sweetness, warm almond and rare cedar shavings.',
  'Sumptuous golden resin, warm almond, and velvety ambergris.',2899,3499,'INR','Unisex','Unisex','Oriental','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1999,"originalPrice":2399},{"size":"100ml","price":2899,"originalPrice":3499}]'::jsonb,
  35,'AURA-GOLDEN-AMBER-100',4.9,88,'/src/assets/images/products/aura-golden-amber_1.jpg',null,
  '["/src/assets/images/products/aura-golden-amber_1.jpg","/src/assets/images/products/aura-golden-amber_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Cinnamate, Coumarin, Benzyl Alcohol.',
  '{"top":["Bitter Almond","Saffron Silk","Bergamot"],"heart":["Golden Amber Resin","Cedarwood","Jasmine Petals"],"base":["Ambergris Accord","Bourbon Vanilla","Spun Sugar"]}'::jsonb,
  '12+ Hours','Enveloping & Warm','Winter / Fall','Intimate Evenings, Gala Nights, Winter Holiday Parties',true,false,true,true
),
(
  'Fleur Blanche','aura-fleur-blanche-eau-de-parfum','AURA',
  'A bouquet of white gardenias and moonlit tuberose bathed in morning dew.',
  'Luminous gardenia and creamy tuberose petals enveloped in cashmere musk.',2199,2699,'INR','Women','Women','Floral','Eau de Parfum','100ml',
  '[{"size":"50ml","price":1549,"originalPrice":1899},{"size":"100ml","price":2199,"originalPrice":2699}]'::jsonb,
  29,'AURA-FLEUR-BLANCHE-100',4.7,43,'/src/assets/images/products/aura-fleur-blanche_1.jpg',null,
  '["/src/assets/images/products/aura-fleur-blanche_1.jpg","/src/assets/images/products/aura-fleur-blanche_3.jpg"]'::jsonb,
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Citronellol, Hydroxycitronellal.',
  '{"top":["White Freesia","Neroli Water","Dewy Pear"],"heart":["Gardenia","Tuberose Milk","Sambac Jasmine"],"base":["White Cedar","Cashmere Musk","Clean Amber"]}'::jsonb,
  '8-9 Hours','Soft to Moderate','Spring / Summer','Morning Weddings, Garden Parties, Serene Days',false,false,false,true
),
(
  'Aventus','creed-aventus-eau-de-parfum','Creed',
  'A bold fragrance inspired by strength, power and success, with pineapple, birch and ambergris.',
  'A regal fragrance opening with smoked birch, blackcurrant, and juicy pineapple.',26500,28900,'INR','Men','Men','Fresh','Eau de Parfum','100ml',
  '[{"size":"50ml","price":18500,"originalPrice":20000},{"size":"100ml","price":26500,"originalPrice":28900}]'::jsonb,
  8,'CREED-AVENTUS-100',4.9,512,'/src/assets/images/products/creed-aventus_1.jpg',null,
  '["/src/assets/images/products/creed-aventus_1.jpg","/src/assets/images/products/creed-aventus_3.jpg"]'::jsonb,
  'Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Citronellol.',
  '{"top":["Pineapple","Bergamot","Blackcurrant Leaves","Apple"],"heart":["Birch Wood","Patchouli","Moroccan Jasmine","Rose"],"base":["Musk","Oakmoss","Ambergris","Vanilla"]}'::jsonb,
  '10-12 Hours','Commanding','All Seasons','Signature, Power Meetings, Milestone Celebrations',false,true,false,false
),
(
  'Gypsy Water','byredo-gypsy-water-eau-de-parfum','Byredo',
  'A woody composition of pine needles, incense, citrus, vanilla and sandalwood.',
  'Pine needle and sandalwood paired with intense amber and fresh citrus.',19200,21000,'INR','Unisex','Unisex','Woody','Eau de Parfum','100ml',
  '[{"size":"50ml","price":13500,"originalPrice":14900},{"size":"100ml","price":19200,"originalPrice":21000}]'::jsonb,
  15,'BYREDO-GYPSY-WATER-100',4.8,168,'/src/assets/images/products/byredo-gypsy-water_1.jpg',null,
  '["/src/assets/images/products/byredo-gypsy-water_1.jpg","/src/assets/images/products/byredo-gypsy-water_3.jpg"]'::jsonb,
  'Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Geraniol.',
  '{"top":["Juniper Berries","Lemon","Bergamot","Pepper"],"heart":["Pine Needles","Incense","Orris Root"],"base":["Vanilla","Sandalwood","Amber"]}'::jsonb,
  '6-8 Hours','Subtle & Sophisticated','Autumn / Spring','Intimate Gatherings, Weekend Strolls, Creative Work',false,false,true,true
)
on conflict (slug) do update set
  name = excluded.name, brand = excluded.brand, description = excluded.description,
  short_description = excluded.short_description, price = excluded.price,
  compare_at_price = excluded.compare_at_price, currency = excluded.currency,
  category = excluded.category, gender = excluded.gender, fragrance_family = excluded.fragrance_family,
  concentration = excluded.concentration, size = excluded.size, available_sizes = excluded.available_sizes,
  stock_quantity = excluded.stock_quantity, sku = excluded.sku, rating = excluded.rating,
  review_count = excluded.review_count, primary_image = excluded.primary_image,
  hover_image = excluded.hover_image, images = excluded.images, ingredients = excluded.ingredients,
  notes = excluded.notes, longevity = excluded.longevity, sillage = excluded.sillage,
  season = excluded.season, occasion = excluded.occasion, is_featured = excluded.is_featured,
  is_bestseller = excluded.is_bestseller, is_new_arrival = excluded.is_new_arrival,
  is_active = excluded.is_active, updated_at = now();

-- Normalize catalog image rows from each product's own image array. No generic fallback images are used.
insert into public.product_images (product_id, image_url, image_type, sort_order, alt_text)
select p.id,
       img.image_url,
       case when img.ordinality = 1 then 'primary' else 'gallery' end,
       img.ordinality::integer,
       p.name || ' product view ' || img.ordinality::text
  from public.products p
  cross join lateral jsonb_array_elements_text(p.images) with ordinality as img(image_url, ordinality)
 where p.slug in (
  'aura-noir-eau-de-parfum','velvet-rose-eau-de-parfum','citrus-dream-eau-de-parfum',
  'ocean-breeze-eau-de-parfum','blush-eau-de-parfum','mystic-oud-eau-de-parfum',
  'dior-sauvage-eau-de-toilette','bleu-de-chanel-eau-de-parfum','chanel-coco-mademoiselle-eau-de-parfum',
  'tom-ford-oud-wood-eau-de-parfum','versace-eros-eau-de-toilette','giorgio-armani-acqua-di-gio-eau-de-toilette',
  'yves-saint-laurent-y-eau-de-parfum','aura-santal-sublime-eau-de-parfum','aura-golden-amber-eau-de-parfum',
  'aura-fleur-blanche-eau-de-parfum','creed-aventus-eau-de-parfum','byredo-gypsy-water-eau-de-parfum'
 )
on conflict (product_id, sort_order) do update set
  image_url = excluded.image_url, image_type = excluded.image_type, alt_text = excluded.alt_text;

insert into public.coupons (code, description, discount_type, discount_value, minimum_order_amount, is_active)
values
  ('AURA10','AURA welcome privilege','percentage',10,0,true),
  ('LUXURY20','Private collection order privilege','percentage',20,3000,true)
on conflict (lower(code)) do update set
  description = excluded.description, discount_type = excluded.discount_type,
  discount_value = excluded.discount_value, minimum_order_amount = excluded.minimum_order_amount,
  is_active = excluded.is_active;

commit;

-- IMPORTANT:
-- 1) New users receive customer role only. Assign admin via the Supabase SQL Editor/dashboard:
--    update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';
-- 2) Card/UPI orders remain payment_status='pending'. Add a trusted payment provider webhook before marking paid.
-- 3) The client must call add_to_cart, set_cart_item_quantity, remove_cart_item and create_order RPCs;
--    do not write cart prices, stock, order totals or payment state from the browser.
